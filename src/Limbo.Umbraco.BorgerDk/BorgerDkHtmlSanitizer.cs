using System;
using System.Collections.Generic;
using System.Linq;
using HtmlAgilityPack;

namespace Limbo.Umbraco.BorgerDk;

/// <summary>
/// Static class for sanitizing the article HTML received from the Borger.dk web service before it is handed to the
/// backoffice.
/// </summary>
/// <remarks>
/// The Umbraco 13 backoffice rendered this HTML through AngularJS' <c>ng-bind-html</c>, which sanitized it via
/// <c>$sanitize</c>. The Umbraco 17 backoffice has no equivalent - a Lit element rendering the markup would inject
/// it straight into the backoffice origin - so the sanitizing moved to the server instead.
/// </remarks>
public static class BorgerDkHtmlSanitizer {

    /// <summary>
    /// Elements that are removed along with their content.
    /// </summary>
    private static readonly HashSet<string> DisallowedElements = new(StringComparer.OrdinalIgnoreCase) {
        "script", "style", "iframe", "frame", "frameset", "object", "embed", "applet", "form", "input",
        "button", "textarea", "select", "link", "meta", "base", "svg", "math"
    };

    /// <summary>
    /// Attributes whose value may reference a URL, and which therefore must be checked for script schemes.
    /// </summary>
    private static readonly HashSet<string> UrlAttributes = new(StringComparer.OrdinalIgnoreCase) {
        "href", "src", "action", "formaction", "xlink:href", "data"
    };

    /// <summary>
    /// Returns a sanitized version of the specified <paramref name="html"/>, with scriptable elements, inline event
    /// handlers and script URLs removed.
    /// </summary>
    /// <param name="html">The HTML to be sanitized.</param>
    /// <returns>The sanitized HTML.</returns>
    public static string Sanitize(string? html) {

        if (string.IsNullOrWhiteSpace(html)) return string.Empty;

        HtmlDocument document = new();
        document.LoadHtml(html);

        if (document.DocumentNode.FirstChild is null) return string.Empty;

        Sanitize(document.DocumentNode);

        return document.DocumentNode.InnerHtml;

    }

    private static void Sanitize(HtmlNode node) {

        // "ChildNodes" is mutated while we iterate, so we need a snapshot
        foreach (HtmlNode child in node.ChildNodes.ToList()) {

            if (child.NodeType == HtmlNodeType.Comment) {
                child.Remove();
                continue;
            }

            if (child.NodeType != HtmlNodeType.Element) continue;

            if (DisallowedElements.Contains(child.Name)) {
                child.Remove();
                continue;
            }

            foreach (HtmlAttribute attribute in child.Attributes.ToList()) {

                // Inline event handlers - "onclick", "onerror" and friends
                if (attribute.Name.StartsWith("on", StringComparison.OrdinalIgnoreCase)) {
                    attribute.Remove();
                    continue;
                }

                // [CHANGE: sanitizer must compare the decoded attribute value, as "HtmlAttribute.Value" keeps HTML
                // entities verbatim - "&#106;avascript:alert(1)" would otherwise pass the scheme check and then be
                // decoded by the browser] Related: PropertyEditors/BorgerDkValueConverter.cs,
                // Scheduling/BorgerDkImportTask.cs, Client/src/modals/article-modal.element.ts,
                // Client/src/modals/search-modal.element.ts
                if (UrlAttributes.Contains(attribute.Name) && IsScriptUrl(attribute.DeEntitizeValue)) {
                    attribute.Remove();
                }

            }

            Sanitize(child);

        }

    }

    private static bool IsScriptUrl(string? value) {

        if (string.IsNullOrWhiteSpace(value)) return false;

        // Strip whitespace and control characters, which may otherwise be used to obfuscate the scheme
        string normalized = new(value.Where(x => !char.IsWhiteSpace(x) && !char.IsControl(x)).ToArray());

        return normalized.StartsWith("javascript:", StringComparison.OrdinalIgnoreCase)
               || normalized.StartsWith("vbscript:", StringComparison.OrdinalIgnoreCase)
               || normalized.StartsWith("data:text/html", StringComparison.OrdinalIgnoreCase);

    }

}

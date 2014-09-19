﻿using System.Web;
using System.Xml.Linq;

namespace Skybrud.Umbraco.BorgerDk.Model {
    
    public class BorgerDkMicroArticle {

        public string Id { get; private set; }
        public string Title { get; private set; }
        public XElement Xml { get; private set; }
        public string Content { get; private set; }

        public HtmlString TitleAsHtml {
            get { return new HtmlString(Title); }
        }

        public HtmlString ContentAsHtml {
            get { return new HtmlString(Content); }
        }

        public static BorgerDkMicroArticle Parse(XElement xBlock) {

            XAttribute xId = xBlock.Attribute("id");
            XElement xTitle = xBlock.Element("title");
            XElement xHtml = xBlock.Element("html");
            XElement xXml = xBlock.Element("xml");

            if (xId == null) return null;
            if (xTitle == null) return null;
            if (xHtml == null) return null;
            if (xXml == null) return null;

            return new BorgerDkMicroArticle {
                Id = xId.Value,
                Title = HttpUtility.HtmlDecode(xTitle.Value),
                Content = xHtml.Value,
                Xml = xXml
            };

        }

    }

}
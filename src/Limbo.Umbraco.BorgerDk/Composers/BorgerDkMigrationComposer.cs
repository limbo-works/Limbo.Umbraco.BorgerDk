using Limbo.Umbraco.BorgerDk.NotificationHandlers;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Notifications;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.Composers;

public class BorgerDkMigrationComposer : IComposer {
    public void Compose(IUmbracoBuilder builder) {
        builder.AddNotificationHandler<UmbracoApplicationStartingNotification, BorgerDkMigrationHandler>();
    }
}
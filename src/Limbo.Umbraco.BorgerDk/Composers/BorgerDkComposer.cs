using Limbo.Umbraco.BorgerDk.Caching;
using Limbo.Umbraco.BorgerDk.NotificationHandlers;
using Limbo.Umbraco.BorgerDk.Notifications;
using Limbo.Umbraco.BorgerDk.Scheduling;
using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.Composers {

    public class BorgerDkComposer : IComposer {

        public void Compose(IUmbracoBuilder builder) {

            // Register services
            builder.Services
                .AddTransient<BorgerDkService>()
                .AddSingleton<BorgerDkCache>()
                .AddSingleton<BorgerDkImportTaskSettings>()
                .AddHostedService<BorgerDkImportTask>();

            // Register cache refresher
            builder.CacheRefreshers()
                .Add<BorgerDkCacheRefresher>();

            // Register notifications
            builder
                .AddNotificationHandler<BorgerDkArticleUpdatedNotification, BorgerDkArticleUpdatedHandler>();

            builder.ManifestFilters().Append<BorgerDkManifestFilter>();

        }

    }

}
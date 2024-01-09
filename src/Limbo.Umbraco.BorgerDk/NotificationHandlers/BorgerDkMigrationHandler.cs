using Limbo.Umbraco.BorgerDk.Migrations;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Migrations;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Cms.Infrastructure.Migrations.Upgrade;
using Umbraco.Cms.Infrastructure.Scoping;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.NotificationHandlers {

    public class BorgerDkMigrationHandler : INotificationHandler<UmbracoApplicationStartingNotification> {

        private readonly IScopeProvider _scopeProvider;
        private readonly IMigrationPlanExecutor _migrationPlanExecutor;
        private readonly IKeyValueService _keyValueService;
        private readonly IRuntimeState _runtimeState;

        public BorgerDkMigrationHandler(IScopeProvider scopeProvider,
            IMigrationPlanExecutor migrationPlanExecutor,
            IKeyValueService keyValueService,
            IRuntimeState runtimeState) {
            _scopeProvider = scopeProvider;
            _migrationPlanExecutor = migrationPlanExecutor;
            _keyValueService = keyValueService;
            _runtimeState = runtimeState;
        }

        public void Handle(UmbracoApplicationStartingNotification notification) {

            if (_runtimeState.Level < RuntimeLevel.Run) return;

            MigrationPlan plan = new("Limbo.Umbraco.BorgerDk");

            plan.From(string.Empty).To<BorgerDkCreateTableMigration>("10.0.0");

            Upgrader upgrader = new(plan);
            upgrader.Execute(_migrationPlanExecutor, _scopeProvider, _keyValueService);

        }

    }

}
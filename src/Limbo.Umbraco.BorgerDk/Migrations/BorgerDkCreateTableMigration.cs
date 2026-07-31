using System.Threading.Tasks;
using Limbo.Umbraco.BorgerDk.Models;
using Umbraco.Cms.Infrastructure.Migrations;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.Migrations;

/// <remarks>
/// <c>MigrationBase</c> is obsolete as of Umbraco 17 and scheduled for removal in Umbraco 18, so this migration is
/// now based on <see cref="AsyncMigrationBase"/>. The migration itself doesn't do anything asynchronous.
/// </remarks>
public class BorgerDkCreateTableMigration : AsyncMigrationBase {

    public BorgerDkCreateTableMigration(IMigrationContext context) : base(context) { }

    protected override Task MigrateAsync() {

        // Exit right away if the Limbo table already exist
        if (TableExists(BorgerDkArticleSchema.TableName)) return Task.CompletedTask;

        // If the legacy Skybrud table exist, we rename it and skip creating the table
        if (TableExists(BorgerDkArticleSchema.LegacyTableName)) {
            Rename.Table(BorgerDkArticleSchema.LegacyTableName).To(BorgerDkArticleSchema.TableName).Do();
            return Task.CompletedTask;
        }

        // If we reach this point, we create the Limbo table
        Create.Table<BorgerDkArticleSchema>().Do();

        return Task.CompletedTask;

    }

}

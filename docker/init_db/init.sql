DROP SCHEMA registry_of_graduates;
DROP TABLE student;

CREATE SCHEMA registry_of_graduates;

CREATE TABLE student
(
    id           bigserial PRIMARY KEY,
    email        varchar(254) NOT NULL UNIQUE,
    pass         varchar(60)  NOT NULL,
    salt         varchar(60)  NOT NULL,
    verification varchar(60)  NOT NULL,
    created_at   timestamp    NOT NULL DEFAULT now(),
    updated_at   timestamp    NOT NULL DEFAULT now()
);
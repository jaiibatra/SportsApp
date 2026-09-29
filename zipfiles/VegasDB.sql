CREATE TABLE INJURY_GENERAL (
    injury_id INT,
    injury_name VARCHAR(100),
    injury_sport VARCHAR(100),
    body_part VARCHAR(100),
    pain_location TEXT,
    swelling VARCHAR(10),
    bruising VARCHAR(10),
    instability VARCHAR(10),
    limited_range_of_motion VARCHAR(10),
    audible_pop VARCHAR(10),
    CONSTRAINT INJURY_PK PRIMARY KEY (injury_id)
);

CREATE TABLE INJURY_SEVERITY (
    severity_id VARCHAR(5),
    severity VARCHAR(10),
    frequency DECIMAL(3,2),
    recovery_time_avg INT,
	can_continue_playing VARCHAR(10),
    injury_id INT,
    CONSTRAINT INJURY_SEVERITY_PK PRIMARY KEY (severity_id),
    CONSTRAINT INJURY_SEVERITY_FK FOREIGN KEY (injury_id) REFERENCES INJURY_GENERAL (injury_id)
);

CREATE TABLE MOVE (
    move_id INT,
    move_name VARCHAR(100),
    move_description TEXT,
    CONSTRAINT MOVE_PK PRIMARY KEY (move_id)
);

CREATE TABLE MOVE_INJURY (
    move_id INT,
    injury_id INT,
    CONSTRAINT MOVE_INJURY_PK PRIMARY KEY (move_id, injury_id),
    CONSTRAINT MOVE_INJURY_FK1 FOREIGN KEY (move_id) REFERENCES MOVE (move_id),
    CONSTRAINT MOVE_INJURY_FK2 FOREIGN KEY (injury_id) REFERENCES INJURY_GENERAL (injury_id)
);



CREATE TABLE Faculty (
                         faculty_id UUID PRIMARY KEY,
                         faculty_name VARCHAR(100),
                         faculty_dean VARCHAR(100),
                         faculty_substitute VARCHAR(100)
);

CREATE TABLE Departments (
                             department_id UUID PRIMARY KEY,
                             faculty_id UUID,
                             department_name VARCHAR(100),
                             head_of_department VARCHAR(100),
                             department_substitute VARCHAR(100),
                             FOREIGN KEY (faculty_id) REFERENCES Faculty (faculty_id)
);

CREATE TABLE Student (
                         student_id UUID PRIMARY KEY,
                         faculty_id UUID,
                         department_id UUID,
                         ticket_number VARCHAR(100) UNIQUE,
                         full_name VARCHAR(100),
                         enrollment_date DATE,
                         education_level VARCHAR,
                         graduation_date DATE DEFAULT(NULL),
                         completion_status BOOL DEFAULT(NULL),
                         is_archived BOOL NOT NULL,
                         created_at TIMESTAMP,
                         updated_at TIMESTAMP,
                         FOREIGN KEY (faculty_id) REFERENCES Faculty (faculty_id),
                         FOREIGN KEY (department_id) REFERENCES Departments (department_id)
);

CREATE TABLE Scientific_Supervisor (
                                       supervisor_id UUID PRIMARY KEY,
                                       department_id UUID,
                                       full_name VARCHAR(100),
                                       FOREIGN KEY (department_id) REFERENCES Departments (department_id)
);

CREATE TABLE Coursework (
                            coursework_id UUID PRIMARY KEY,
                            student_id UUID,
                            supervisor_id UUID,
                            coursework_title VARCHAR(200),
                            coursework_grade INT,
                            FOREIGN KEY (student_id) REFERENCES Student (student_id) ON DELETE CASCADE,
                            FOREIGN KEY (supervisor_id) REFERENCES Scientific_Supervisor (supervisor_id)
);

CREATE TABLE Diploma (
                         diploma_id UUID PRIMARY KEY,
                         student_id UUID,
                         supervisor_id UUID,
                         diploma_title VARCHAR(200),
                         diploma_grade INT,
                         FOREIGN KEY (student_id) REFERENCES Student (student_id) ON DELETE CASCADE,
                         FOREIGN KEY (supervisor_id) REFERENCES Scientific_Supervisor (supervisor_id)
);
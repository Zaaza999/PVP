-- initial_schema.sql

USE komunalinis_db;

-- 1. Roles table
CREATE TABLE IF NOT EXISTS Roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
);

-- 2. Main Users table
CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    address VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    FOREIGN KEY (role_id) REFERENCES Roles(role_id)
);

-- 3. Visit topics (e.g., reasons/subjects for a visit/consultation)
CREATE TABLE IF NOT EXISTS VisitTopics (
    topic_id INT AUTO_INCREMENT PRIMARY KEY,
    topic_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 4. Employee time slots (when employees are available for a specific topic)
CREATE TABLE IF NOT EXISTS EmployeeTimeSlots (
    timeslot_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    slot_date DATE NOT NULL,
    time_from TIME NOT NULL,
    time_to TIME NOT NULL,
    topic_id INT NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES Users(user_id),
    FOREIGN KEY (topic_id) REFERENCES VisitTopics(topic_id)
);

-- 5. Reservations
CREATE TABLE IF NOT EXISTS Reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    timeslot_id INT NOT NULL,
    reservation_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Confirmed',
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (timeslot_id) REFERENCES EmployeeTimeSlots(timeslot_id)
);

-- 6. Locations (towns, villages, districts, etc.)
CREATE TABLE IF NOT EXISTS Locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 7. Waste types
CREATE TABLE IF NOT EXISTS WasteTypes (
    waste_id INT AUTO_INCREMENT PRIMARY KEY,
    waste_name VARCHAR(100) NOT NULL
);

-- 8. Garbage collection schedule
CREATE TABLE IF NOT EXISTS GarbageCollectionSchedule (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    location_id INT NOT NULL,
    waste_id INT NOT NULL,
    collection_date DATE NOT NULL,
    comment TEXT,
    FOREIGN KEY (location_id) REFERENCES Locations(location_id),
    FOREIGN KEY (waste_id) REFERENCES WasteTypes(waste_id)
);

-- Insert initial roles
INSERT INTO Roles (role_name) VALUES
('User'),
('Employee'),
('Administrator');

-- Insert initial waste types
INSERT INTO WasteTypes (waste_name) VALUES
('Household'),
('Plastic/Metal/Paper'),
('Glass');

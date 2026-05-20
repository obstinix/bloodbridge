-- Migration: Add Latitude and Longitude to Donor and Hospital tables
-- Default values are set to Chicago (41.8781, -87.6298) for demonstration compatibility

ALTER TABLE Donor ADD COLUMN Latitude DECIMAL(10, 8) NOT NULL DEFAULT 41.878112;
ALTER TABLE Donor ADD COLUMN Longitude DECIMAL(11, 8) NOT NULL DEFAULT -87.629798;

ALTER TABLE Hospital ADD COLUMN Latitude DECIMAL(10, 8) NOT NULL DEFAULT 41.878112;
ALTER TABLE Hospital ADD COLUMN Longitude DECIMAL(11, 8) NOT NULL DEFAULT -87.629798;

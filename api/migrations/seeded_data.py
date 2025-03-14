steps = [
    [
        # "Up" SQL statement
        """
        INSERT INTO gigs (title, price, boxes, description, pickup_location, pickup_date, dropoff_location, dropoff_date, created_on_date) 
        VALUES
        ('John''s Office Move', 1500, '20+', 'Moving office equipment', '{"street_address": "123 Main St", "street_address_two": "Suite 500", "city": "Milwaukee", "state": "WI", "zip_code": "53202"}', '2024-06-19T08:00:00Z', '{"street_address": "456 Elm St", "street_address_two": "", "city": "Madison", "state": "WI", "zip_code": "53703"}', '2024-06-19T12:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('Sarah''s Home Move', 1200, '50+', 'Moving home furniture and boxes', '{"street_address": "789 Oak St", "street_address_two": "", "city": "Orlando", "state": "FL", "zip_code": "32801"}', '2024-06-20T09:00:00Z', '{"street_address": "101 Pine St", "street_address_two": "Apt 305", "city": "Tampa", "state": "FL", "zip_code": "33602"}', '2024-06-20T17:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('Mike''s Small Move', 300, '5+', 'Moving a few items', '{"street_address": "202 Maple St", "street_address_two": "", "city": "Los Angeles", "state": "CA", "zip_code": "90001"}', '2024-06-21T10:00:00Z', '{"street_address": "303 Cedar St", "street_address_two": "", "city": "San Diego", "state": "CA", "zip_code": "92101"}', '2024-06-21T14:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('Emma''s Cross-town Move', 800, '30+', 'Moving across town', '{"street_address": "404 Birch St", "street_address_two": "", "city": "Green Bay", "state": "WI", "zip_code": "54303"}', '2024-06-22T07:00:00Z', '{"street_address": "505 Walnut St", "street_address_two": "", "city": "Appleton", "state": "WI", "zip_code": "54911"}', '2024-06-22T11:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('James''s Long Distance Move', 2000, '100+', 'Long distance move', '{"street_address": "606 Spruce St", "street_address_two": "", "city": "Miami", "state": "FL", "zip_code": "33101"}', '2024-06-23T06:00:00Z', '{"street_address": "707 Chestnut St", "street_address_two": "", "city": "Jacksonville", "state": "FL", "zip_code": "32202"}', '2024-06-23T18:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('Anna''s Office Relocation', 1300, '40+', 'Relocating office', '{"street_address": "808 Poplar St", "street_address_two": "Suite 100", "city": "Sacramento", "state": "CA", "zip_code": "95814"}', '2024-06-24T08:00:00Z', '{"street_address": "909 Cypress St", "street_address_two": "", "city": "San Francisco", "state": "CA", "zip_code": "94103"}', '2024-06-24T15:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('Chris''s Local Move', 600, '10+', 'Local move within the city', '{"street_address": "1010 Willow St", "street_address_two": "", "city": "Fort Lauderdale", "state": "FL", "zip_code": "33301"}', '2024-06-25T09:00:00Z', '{"street_address": "1111 Palm St", "street_address_two": "", "city": "Boca Raton", "state": "FL", "zip_code": "33432"}', '2024-06-25T13:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('David''s Home Move', 1100, '25+', 'Moving household items', '{"street_address": "1212 Dogwood St", "street_address_two": "", "city": "Madison", "state": "WI", "zip_code": "53711"}', '2024-06-26T07:00:00Z', '{"street_address": "1313 Hawthorn St", "street_address_two": "", "city": "Milwaukee", "state": "WI", "zip_code": "53212"}', '2024-06-26T12:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('Olivia''s Storage Move', 700, '15+', 'Moving items to storage', '{"street_address": "1414 Pine St", "street_address_two": "", "city": "Tampa", "state": "FL", "zip_code": "33603"}', '2024-06-27T10:00:00Z', '{"street_address": "1515 Fir St", "street_address_two": "Unit B", "city": "Orlando", "state": "FL", "zip_code": "32802"}', '2024-06-27T14:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('Sophia''s Small Move', 500, '10+', 'Small move within the state', '{"street_address": "1616 Redwood St", "street_address_two": "", "city": "San Jose", "state": "CA", "zip_code": "95112"}', '2024-06-28T08:00:00Z', '{"street_address": "1717 Juniper St", "street_address_two": "", "city": "Fresno", "state": "CA", "zip_code": "93702"}', '2024-06-28T11:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('Ethan''s Apartment Move', 900, '20+', 'Moving apartment belongings', '{"street_address": "1818 Holly St", "street_address_two": "Apt 4", "city": "San Diego", "state": "CA", "zip_code": "92102"}', '2024-06-29T09:00:00Z', '{"street_address": "1919 Ash St", "street_address_two": "Apt 5", "city": "Los Angeles", "state": "CA", "zip_code": "90002"}', '2024-06-29T14:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('Mia''s House Move', 1500, '60+', 'Moving house items', '{"street_address": "2020 Elm St", "street_address_two": "", "city": "Miami", "state": "FL", "zip_code": "33102"}', '2024-06-30T07:00:00Z', '{"street_address": "2121 Birch St", "street_address_two": "", "city": "Fort Lauderdale", "state": "FL", "zip_code": "33302"}', '2024-06-30T13:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('Lucas''s Condo Move', 1100, '30+', 'Condo to condo move', '{"street_address": "2222 Cedar St", "street_address_two": "Unit 301", "city": "Madison", "state": "WI", "zip_code": "53712"}', '2024-07-01T08:00:00Z', '{"street_address": "2323 Oak St", "street_address_two": "Unit 302", "city": "Milwaukee", "state": "WI", "zip_code": "53213"}', '2024-07-01T12:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('Ava''s Local Move', 800, '20+', 'Local move within the city', '{"street_address": "2424 Maple St", "street_address_two": "", "city": "Orlando", "state": "FL", "zip_code": "32803"}', '2024-07-02T09:00:00Z', '{"street_address": "2525 Spruce St", "street_address_two": "", "city": "Tampa", "state": "FL", "zip_code": "33604"}', '2024-07-02T13:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('Aiden''s Home Move', 1700, '70+', 'Moving home furniture and boxes', '{"street_address": "2626 Fir St", "street_address_two": "", "city": "San Francisco", "state": "CA", "zip_code": "94104"}', '2024-07-03T07:00:00Z', '{"street_address": "2727 Pine St", "street_address_two": "", "city": "Sacramento", "state": "CA", "zip_code": "95815"}', '2024-07-03T12:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('Isabella''s Storage Move', 600, '15+', 'Moving items to storage', '{"street_address": "2828 Holly St", "street_address_two": "", "city": "San Jose", "state": "CA", "zip_code": "95113"}', '2024-07-04T10:00:00Z', '{"street_address": "2929 Ash St", "street_address_two": "Unit C", "city": "Fresno", "state": "CA", "zip_code": "93703"}', '2024-07-04T14:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('Mason''s Office Relocation', 1400, '35+', 'Office relocation', '{"street_address": "3030 Birch St", "street_address_two": "Suite 200", "city": "Milwaukee", "state": "WI", "zip_code": "53214"}', '2024-07-05T08:00:00Z', '{"street_address": "3131 Elm St", "street_address_two": "", "city": "Madison", "state": "WI", "zip_code": "53713"}', '2024-07-05T15:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('Sophia''s Apartment Move', 1000, '25+', 'Moving apartment items', '{"street_address": "3232 Cedar St", "street_address_two": "Apt 6", "city": "Fort Lauderdale", "state": "FL", "zip_code": "33303"}', '2024-07-06T09:00:00Z', '{"street_address": "3333 Pine St", "street_address_two": "Apt 7", "city": "Miami", "state": "FL", "zip_code": "33103"}', '2024-07-06T14:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('Oliver''s Small Move', 400, '5+', 'Small local move', '{"street_address": "3434 Maple St", "street_address_two": "", "city": "San Francisco", "state": "CA", "zip_code": "94105"}', '2024-07-07T10:00:00Z', '{"street_address": "3535 Fir St", "street_address_two": "", "city": "Sacramento", "state": "CA", "zip_code": "95816"}', '2024-07-07T13:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('Lucas''s House Move', 1800, '80+', 'Household move', '{"street_address": "3636 Holly St", "street_address_two": "", "city": "San Diego", "state": "CA", "zip_code": "92103"}', '2024-07-08T07:00:00Z', '{"street_address": "3737 Ash St", "street_address_two": "", "city": "Los Angeles", "state": "CA", "zip_code": "90003"}', '2024-07-08T13:00:00Z', '2024-06-18T06:24:18.454Z'),
        ('Evelyn''s Office Move', 1600, '40+', 'Office move across the state', '{"street_address": "3838 Birch St", "street_address_two": "Suite 300", "city": "Madison", "state": "WI", "zip_code": "53714"}', '2024-07-09T08:00:00Z', '{"street_address": "3939 Elm St", "street_address_two": "", "city": "Milwaukee", "state": "WI", "zip_code": "53215"}', '2024-07-09T14:00:00Z', '2024-06-18T06:24:18.454Z');
        """,
        # "Down" SQL statement
        """
        DELETE FROM gigs WHERE title IN (
            'John''s Office Move',
            'Sarah''s Home Move',
            'Mike''s Small Move',
            'Emma''s Cross-town Move',
            'James''s Long Distance Move',
            'Anna''s Office Relocation',
            'Chris''s Local Move',
            'David''s Home Move',
            'Olivia''s Storage Move',
            'Sophia''s Small Move',
            'Ethan''s Apartment Move',
            'Mia''s House Move',
            'Lucas''s Condo Move',
            'Ava''s Local Move',
            'Aiden''s Home Move',
            'Isabella''s Storage Move',
            'Mason''s Office Relocation',
            'Sophia''s Apartment Move',
            'Oliver''s Small Move',
            'Lucas''s House Move',
            'Evelyn''s Office Move'
        );
        """,
    ],
]

import requests
import json
from faker import Faker
import random
import os
import shutil

fake = Faker()

def generate_fake_accounts(num_accounts=100, role='patient'):
    accounts = []
    for i in range(num_accounts):
        user = {
            "firstName": fake.first_name(),
            "lastName": fake.last_name(),
            "email": fake.email(),
            "password": "1234",
            "profilePicture": get_random_profile_picture(i, role)
        }

        if role == 'patient':
            user.update({
                "preferredLanguage": fake.language_name(),
                "issues": [fake.word() for _ in range(3)],
                "locationPreference": fake.random_element(elements=('Remote', 'In-person', 'No Preference'))
            })
        elif role == 'psychologist':
            user.update({
                "languages": [fake.language_name() for _ in range(3)],
                "specialization": [fake.job() for _ in range(2)],
                "geoLocation": {
                    "lat": random.uniform(41.0, 51.0),  # Latitude range for France
                    "long": random.uniform(-5.0, 9.0)   # Longitude range for France
                },
                "bio": fake.text(),
                "ratings": [fake.random_int(min=1, max=5) for _ in range(10)],
                "availableTimes": [{"day": fake.day_of_week(), "timeSlots": [{"start": "09:00", "end": "17:00"}]} for _ in range(5)]
            })

        accounts.append(user)
    
    return accounts

def get_random_profile_picture(index, role):
    response = requests.get("https://randomuser.me/api/")
    data = response.json()
    img_url = data['results'][0]['picture']['large']
    img_data = requests.get(img_url).content
    filename = f'{role}_{index}.jpg'
    filepath = os.path.join('images', filename)
    
    # Create directory if it does not exist
    os.makedirs('images', exist_ok=True)
    
    with open(filepath, 'wb') as handler:
        handler.write(img_data)
    
    return filepath

def move_images_to_server():
    source_dir = 'images'
    target_dir = os.path.join('..', 'server', 'images')
    if os.path.exists(target_dir):
        shutil.rmtree(target_dir)
    shutil.move(source_dir, target_dir)

def save_accounts_to_file(accounts, filename):
    with open(filename, 'w') as f:
        json.dump(accounts, f, indent=4)

if __name__ == "__main__":
    patient_accounts = generate_fake_accounts(num_accounts=99, role='patient')
    psychologist_accounts = generate_fake_accounts(num_accounts=99, role='psychologist')
    
    # Ajouter un compte patient prédéfini
    patient_accounts.append({
        "firstName": "Test",
        "lastName": "Patient",
        "email": "test.patient@example.com",
        "password": "1234",
        "profilePicture": get_random_profile_picture(100, 'patient'),
        "preferredLanguage": "English",
        "issues": ["anxiety", "stress"],
        "locationPreference": "Remote"
    })

    # Ajouter un compte psychologue prédéfini
    psychologist_accounts.append({
        "firstName": "Test",
        "lastName": "Psychologist",
        "email": "test.psychologist@example.com",
        "password": "1234",
        "profilePicture": get_random_profile_picture(100, 'psychologist'),
        "languages": ["English", "French"],
        "specialization": ["Cognitive Behavioral Therapy", "Mindfulness"],
        "geoLocation": {
            "lat": 48.8566,  # Latitude for Paris
            "long": 2.3522   # Longitude for Paris
        },
        "bio": "Experienced psychologist specializing in CBT and mindfulness.",
        "ratings": [5, 4, 5, 3, 4],
        "availableTimes": [{"day": "Monday", "timeSlots": [{"start": "09:00", "end": "17:00"}]}]
    })
    
    save_accounts_to_file(patient_accounts, 'patients.json')
    save_accounts_to_file(psychologist_accounts, 'psychologists.json')

    # Move images to the server directory
    move_images_to_server()

    print("Faux comptes générés et enregistrés dans patients.json et psychologists.json")

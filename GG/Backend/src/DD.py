import random
import numpy as np

def generate_dummy_data(n: int) :

    """
    Generates dummy data to use for development and testing
    Parameters: 
        n - Number of random entries to generate
    Return:
        data - Numpy 2d array containing randomly generated user ids and data
    """

    data = np.zeros(shape=(n, 8)).astype(str)
    language = ['English', 'Korean']
    proficiency = ['Beginner', 'Elementary', 'Intermediate', 'Proficient', 'Fluent']
    gender = ['Male', 'Female', 'Other']
    profession = ['Education', 'Engineering', 'Retail', 'Finance', 'Law', 'Medecine']
    hobby = ['Reading', 'Sport', 'Gardening', 'Workout', 'Music', 'Art', 'Photography'
    , 'Writing', 'Gaming', 'Cooking', 'Fishing']

    for i in range(0, n) :
        userid = 'User' + str(i)
        flip = random.choice([0,1])
        if flip == 0 :
            native = 'English'
            target = 'Korean'
        else :
            native = 'Korean'
            target = 'English'
        entry = np.array([userid, native, target, random.choice(proficiency), str(random.randint(18, 30)),
        random.choice(gender), random.choice(profession), random.choice(hobby)])
        
        data[i] = entry

    return data
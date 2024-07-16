import numpy as np
import DD

def find_best_match(user: np.ndarray, n: int = 10) :

    """
    Finds the n best matches from an asortment of users for the input user data
    Parameters:
        user - Numpy array containing the current user's data
        n - Int representing the number of matches to find, default is 10
    Returns:
        best_match - Numpy array subset of users containg the n best matches
    """

    users = DD.generate_dummy_data(101)
    weights = np.array([6, 5, 5])
    scores = np.ndarray(shape=(100,1))
    for i in range(0, 100) :
        compare = (np.compare_chararrays(user[5:], users[i, 5:], cmp='==', rstrip=True))
        score = np.sum((weights*compare)) - (0.3 * np.abs((int(users[i,4])-int(user[4]))))
        if users[i, 1] == user[1] :
            score = -10000
        scores[i] = score

    index = np.flip(np.argsort(np.squeeze(scores)))[0:10]

    best_match = np.take(users, index, axis=0)

    return best_match

print(find_best_match(user=np.array(['Clee789', 'English', 'Korean', 'Elementary', '21', 'Male', 'Engineering', 'Gaming'])))
function getLoggedInUser(custID) {
    if (custID != null || custID != undefined) {
        return { currentUser: custID };
    }
    else {
        return {
            currentUser: "null", desc: 'User not found. Please login to continue.'
        };
    }
}

exports.getLoggedInUser = getLoggedInUser;
const mockValidateEmail = async (email) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email.includes('@')) {
                resolve({ valid: true });
            } else {
                resolve({ valid: false });
            }
        }, 100);
    });
};

export default mockValidateEmail;
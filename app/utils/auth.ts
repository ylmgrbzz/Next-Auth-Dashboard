import bcrypt from 'bcryptjs';

/**
 * Şifreyi hashler
 * @param password Hashlenecek şifre
 * @returns Hashlenmiş şifre
 */
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

/**
 * Şifreleri karşılaştırır
 * @param enteredPassword Kullanıcının girdiği şifre
 * @param hashedPassword Veritabanındaki hashlenmiş şifre
 * @returns Şifrelerin eşleşip eşleşmediği
 */
export const comparePasswords = async (
    enteredPassword: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(enteredPassword, hashedPassword);
}; 
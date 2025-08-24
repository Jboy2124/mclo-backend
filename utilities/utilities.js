const argon2 = require("argon2");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const { generateAccessToken, generateRefreshToken } = require("./jwt");

module.exports = {
  generateOTP: () => {
    const chars = "0123456789";
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return otp; // e.g. 'A9D2ZQ'
  },
  hashPassword: async (password) => {
    const result = await argon2.hash(password);
    return result ?? "";
  },
  verifyPassword: async (hashedPassword, password) => {
    const result = await argon2.verify(hashedPassword, password);
    return result;
  },
  updatePdfTitle: async (filePath, newTitle) => {
    try {
      const existingPdfBytes = fs.readFileSync(filePath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      pdfDoc.setTitle(newTitle);

      const updatedPdfBytes = await pdfDoc.save();
      fs.writeFileSync(filePath, updatedPdfBytes);
    } catch (error) {
      console.error("❌ Error updating PDF title:", error);
      throw error;
    }
  },
  getToken: (params, type) => {
    let token = "";
    if (params) {
      const { email, fname, access } = params;
      if (type === "access") {
        token = generateAccessToken({ email, fname, access });
      } else {
        token = generateRefreshToken({ email, fname, access });
      }
      return token;
    }
  },
};

import otpGenerator from "otp-generator";
class OtpGenerator {
  public numberGenerate(length: number) {
    return otpGenerator.generate(length, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
  }
}
export default OtpGenerator;

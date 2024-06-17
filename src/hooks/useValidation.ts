const useValidation = () => {
  const isEmailValid = (email: string): boolean => {
    // 간단한 이메일 유효성 체크 정규식 사용
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password: string): boolean => {
    // 비밀번호는 영문자와 숫자를 포함하고, 8~16 자 사이여야 함
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    return passwordRegex.test(password);
  };

  const isGroupPasswordValid = (password: string): boolean => {
    // 비밀번호는 영문자와 숫자를 포함하고, 8자여야 함
    const passwordRegex = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9]{4,8}$/;
    return passwordRegex.test(password);
  };

  return { isEmailValid, isPasswordValid, isGroupPasswordValid };
};

export default useValidation;

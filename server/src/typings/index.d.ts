export type UserInRequest = {
  googleID: string;
  email: string;
};

export type GoogleVerifyResponse = {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: string;
  at_hash: string;
  nonce: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: string;
  exp: string;
  alg: string;
  kid: string;
  typ: string;
};

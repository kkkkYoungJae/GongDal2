import _mock from './_mock';

export const _contact = [...Array(18)].map((_, index) => ({
  blocked: false,
  favorites: false,
  friend: true,
  friendId: index,
  nickname: _mock.name.fullName(index),
  profileUrl: _mock.image.avatar(index),
  statusMsg: _mock.text.title(index),
  userId: index,
  key: index,
}));

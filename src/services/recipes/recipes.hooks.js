const { authenticate } = require('feathers-authentication').hooks;
const { restrictToOwner, associateCurrentUser, restrictToAuthenticated } = require('feathers-authentication-hooks');
const { populate } = require('feathers-hooks-common');

const restrict = [
  authenticate('jwt'),
  restrictToAuthenticated(),
];

const restrictToOwners = [
  ...restrict,
  restrictToOwner({
    ownerField: 'authorId'
  })
];

// Configure where we will get the author data from (the users service),
// how to fetch it (by authorId), and where to put it (author).
const authorSchema = {
  include: {
    service: 'users',
    nameAs: 'author',
    parentField: 'authorId',
    childField: '_id'
  }
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      ...restrict,
      associateCurrentUser({ as: 'authorId' }),
    ],
    update: [
      ...restrictToOwners,
    ],
    patch: [
      ...restrictToOwners,
    ],
    remove: [
      ...restrictToOwners,
    ]
  },

  after: {
    all: [
      populate({ schema: authorSchema }),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

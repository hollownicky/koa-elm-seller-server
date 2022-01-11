module.exports = {
  category: {
    name: 'string',
    type: {
      type: 'enum',
      values: [-1, 0, 1, 2, 3, 4]
    }
  },
  food: {
    name: {
      type: 'string',
      required: false
    },
    price: {
      type: 'number',
      required: false
    },
    info: {
      type: 'string',
      required: false,
      allowEmpty: true
    },
    description: {
      type: 'string',
      required: false,
      allowEmpty: true
    },
    image: {
      type: 'string',
      required: true
    }
  },
  admin: {
    oldPassword: {
      type: 'string',
      min: 6
    },
    newPassword: {
      type: 'string',
      min: 6
    },
    password: {
      type: 'string',
      min: 6
    },
    username: {
      type: 'string',
      required: true
    }
  },
  seller: {
    avatar: 'string',
    bulletin: 'string',
    deliveryPrice: 'integer',
    infos: 'array',
    minPrice: 'integer',
    name: 'string',
    pics: 'array',
    supports: 'array'
  }
}
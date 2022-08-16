module.exports = {
  noteSchema: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
      date: {
        type: 'string',
        format: 'date',
      },
      workingHours: {
        type: 'number',
        minimum: 0,
      },
      type: {
        type: 'string',
        enum: ['office', 'remote', 'medical', 'vacation'],
      },
      comment: {
        type: 'string',
      },
    },
    required: ['email', 'date', 'workingHours', 'type'],
    additionalProperties: false,
  },
  emailSchema: {
    type: 'string',
    format: 'email',
  },
};

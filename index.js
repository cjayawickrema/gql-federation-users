const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const userMockData = [
    {
        email: 'tony@abc.com',
        name: 'Tony',
        library: ['ABC1234', 'XYZ1234', 'PQR1234'],
        favoritePublishers: ['P001', 'P002']
    },
    {
        email: 'bruce@xyc.com',
        name: 'Bruce',
        library: ['PQR6789', 'XYZ1234'],
        favoritePublishers: ['P002', 'P003']
    },
];

const typeDefs = gql`

    extend type Book @key(fields: "isbn") {
        isbn: String! @external
    }

    extend type Publisher @key(fields: "id") {
        id: ID! @external
    }

    type User {
        email: String!
        name: String
        library: [Book]
        favoritePublishers: [Publisher]
    }

    type Query {
        getUserDetails(email: String!): User
        users: [User]
    }
`;

const resolvers = {
    Query: {
        getUserDetails(_, { email }) {
            return userMockData.find(user => user.email === email)
        },
        users: () => userMockData,
    },
    User: {
        library(user) {
            return user.library.map(book => {
                return {
                    __typename: "Book", isbn: book
                }
            });
        },
        favoritePublishers(user) {
            return user.favoritePublishers.map(id => {
                return {
                    __typename: "Publisher", id: id
                }
            });
        },
    }
};

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

// The `listen` method launches a web server.
server.listen(4003).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
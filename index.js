const {ApolloServer, gql} = require('apollo-server');
const {buildFederatedSchema} = require('@apollo/federation');

const userMockData = [
    {
        email: 'tony@abc.com',
        name: 'Tony',
        library: ['ABC1234', 'XYZ1234', 'PQR1234']
    },
    {
        email: 'bruce@xyc.com',
        name: 'Bruce',
        library: ['PQR6789', 'XYZ1234']
    },
];

const typeDefs = gql`

    extend type Book @key(fields: "isbn") {
        isbn: String! @external
    }

    type User {
        email: String!
        name: String
        library: [Book]
    }

    type Query {
        getUserDetails(email: String!): User
    }
`;

const resolvers = {
    Query: {
        getUserDetails: (email) => {
console.log(email);
            return userMockData.find( user => user.email === email)
        },
    },
    User: {
        library(user) {
            return user.library.map(book => 
                {
                    return {
                        __typename: "Book", id: book.isbn
                    }
                }
            );
        }
    }
};

const server = new ApolloServer({
    schema: buildFederatedSchema([{typeDefs, resolvers}])
});


// The `listen` method launches a web server.
server.listen(4003).then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});
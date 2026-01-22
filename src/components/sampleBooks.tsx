export interface Book {
    id: string;
    volumeInfo: {
        title: string;
        authors: string[];
        imageLinks: {
            thumbnail: string;
        };
    };
    saleInfo: {
        listPrice: {
            amount: number;
        };
    };
}

export const sampleBooks: Book[] = [
    {
        id: "1",
        volumeInfo: {
            title: "Atomic Habits",
            authors: ["James Clear"],
            imageLinks: {
                thumbnail:
                    "https://books.google.com/books/content?id=atomicHabits&printsec=frontcover&img=1&zoom=1",
            },
        },
        saleInfo: {
            listPrice: {
                amount: 399,
            },
        },
    },
    {
        id: "2",
        volumeInfo: {
            title: "The Psychology of Money",
            authors: ["Morgan Housel"],
            imageLinks: {
                thumbnail:
                    "https://books.google.com/books/content?id=psychologyMoney&printsec=frontcover&img=1&zoom=1",
            },
        },
        saleInfo: {
            listPrice: {
                amount: 349,
            },
        },
    },
    {
        id: "3",
        volumeInfo: {
            title: "Deep Work",
            authors: ["Cal Newport"],
            imageLinks: {
                thumbnail:
                    "https://books.google.com/books/content?id=deepWork&printsec=frontcover&img=1&zoom=1",
            },
        },
        saleInfo: {
            listPrice: {
                amount: 299,
            },
        },
    },
    {
        id: "4",
        volumeInfo: {
            title: "Ikigai",
            authors: ["Héctor García", "Francesc Miralles"],
            imageLinks: {
                thumbnail:
                    "https://books.google.com/books/content?id=ikigai&printsec=frontcover&img=1&zoom=1",
            },
        },
        saleInfo: {
            listPrice: {
                amount: 279,
            },
        },
    },
    {
        id: "5",
        volumeInfo: {
            title: "Rich Dad Poor Dad",
            authors: ["Robert T. Kiyosaki"],
            imageLinks: {
                thumbnail:
                    "https://books.google.com/books/content?id=richDadPoorDad&printsec=frontcover&img=1&zoom=1",
            },
        },
        saleInfo: {
            listPrice: {
                amount: 399,
            },
        },
    },
    {
        id: "6",
        volumeInfo: {
            title: "Atomic Habits",
            authors: ["James Clear"],
            imageLinks: {
                thumbnail:
                    "https://books.google.com/books/content?id=atomicHabits&printsec=frontcover&img=1&zoom=1",
            },
        },
        saleInfo: {
            listPrice: {
                amount: 399,
            },
        },
    },
    {
        id: "7",
        volumeInfo: {
            title: "Atomic Habits",
            authors: ["James Clear"],
            imageLinks: {
                thumbnail:
                    "https://books.google.com/books/content?id=atomicHabits&printsec=frontcover&img=1&zoom=1",
            },
        },
        saleInfo: {
            listPrice: {
                amount: 399,
            },
        },
    },
    {
        id: "8",
        volumeInfo: {
            title: "Atomic Habits",
            authors: ["James Clear"],
            imageLinks: {
                thumbnail:
                    "https://books.google.com/books/content?id=atomicHabits&printsec=frontcover&img=1&zoom=1",
            },
        },
        saleInfo: {
            listPrice: {
                amount: 399,
            },
        },
    },
    {
        id: "9",
        volumeInfo: {
            title: "Atomic Habits",
            authors: ["James Clear"],
            imageLinks: {
                thumbnail:
                    "https://books.google.com/books/content?id=atomicHabits&printsec=frontcover&img=1&zoom=1",
            },
        },
        saleInfo: {
            listPrice: {
                amount: 399,
            },
        },
    },
    {
        id: "10",
        volumeInfo: {
            title: "Atomic Habits",
            authors: ["James Clear"],
            imageLinks: {
                thumbnail:
                    "https://books.google.com/books/content?id=atomicHabits&printsec=frontcover&img=1&zoom=1",
            },
        },
        saleInfo: {
            listPrice: {
                amount: 399,
            },
        },
    },
];

export type ActorRole = {
    movieName: string;
    characterName: string;
};

export type Actor = {
    name: string;
    roles: ActorRole[];
};

export type CharacterActor = {
    actorName: string;
    movieName: string;
};

export type Character = {
    name: string;
    actors: CharacterActor[];
};
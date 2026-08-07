import { relations } from 'drizzle-orm';
import { users } from './users';
import { profiles } from './profiles';
import { novels } from './novels';
import { authSessions } from './auth-sessions';
import { reviews } from './reviews';
import { comments } from './comments';
import { chapters } from './chapters';
import { novelGenres } from './novel-genres';
import { libraryEntries } from './library-entries';
import { readingHistory } from './reading-history';
import { genres } from './genres';

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  authoredNovels: many(novels),
  sessions: many(authSessions),
  reviews: many(reviews),
  comments: many(comments),
  libraryEntries: many(libraryEntries),
  readingHistory: many(readingHistory),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
}));

export const authSessionsRelations = relations(authSessions, ({ one }) => ({
  user: one(users, { fields: [authSessions.userId], references: [users.id] }),
}));

export const novelsRelations = relations(novels, ({ one, many }) => ({
  author: one(users, { fields: [novels.authorId], references: [users.id] }),
  chapters: many(chapters),
  novelGenres: many(novelGenres),
  reviews: many(reviews),
  libraryEntries: many(libraryEntries),
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  novel: one(novels, { fields: [chapters.novelId], references: [novels.id] }),
  comments: many(comments),
  readingHistory: many(readingHistory),
}));

export const genresRelations = relations(genres, ({ many }) => ({
  novelGenres: many(novelGenres),
}));

export const novelGenresRelations = relations(novelGenres, ({ one }) => ({
  novel: one(novels, {
    fields: [novelGenres.novelId],
    references: [novels.id],
  }),
  genre: one(genres, {
    fields: [novelGenres.genreId],
    references: [genres.id],
  }),
}));

export const libraryEntriesRelations = relations(libraryEntries, ({ one }) => ({
  user: one(users, { fields: [libraryEntries.userId], references: [users.id] }),
  novel: one(novels, {
    fields: [libraryEntries.novelId],
    references: [novels.id],
  }),
}));

export const readingHistoryRelations = relations(readingHistory, ({ one }) => ({
  user: one(users, { fields: [readingHistory.userId], references: [users.id] }),
  chapter: one(chapters, {
    fields: [readingHistory.chapterId],
    references: [chapters.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [comments.chapterId],
    references: [chapters.id],
  }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'replies',
  }),
  replies: many(comments, { relationName: 'replies' }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  novel: one(novels, { fields: [reviews.novelId], references: [novels.id] }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}));

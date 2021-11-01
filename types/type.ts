// @ts-nocheck
/* eslint-disable */

// *******************************************************
// *******************************************************
//
// GENERATED FILE, DO NOT MODIFY
//
// Made by Victor Garcia ®
//
// https://github.com/victorgarciaesgi
// *******************************************************
// *******************************************************
// 💙

export type Maybe<T> = T | null;
export interface SelectValue {
  label: string;
  value: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  videos: Video[];
}

export interface Video {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  categories: Maybe<Category[]>;
  user: Maybe<User>;
  user_id: Maybe<string>;
  youtube_id: Maybe<string>;
  description: Maybe<string>;
  statistics: Maybe<YoutubeStatistic>;
  metadata: Maybe<YoutubeMetadata>;
}

export interface User {
  id: string;
  name: string;
  username: string;
  title: Maybe<string>;
  subscription_type: Maybe<string>;
  roles: Maybe<string>;
  is_admin: boolean;
  description: Maybe<string>;
  is_banned: boolean;
  banned_reason: Maybe<string>;
  myparent: Maybe<User>;
  parent_id: Maybe<string>;
  metadata: Maybe<string>;
  email: string;
  created_at: string;
  updated_at: string;
  subscription_expired_at: Maybe<string>;
  province_id: Maybe<string>;
  city_id: Maybe<string>;
  district_id: Maybe<string>;
  province: Maybe<Province>;
  district: Maybe<District>;
  city: Maybe<City>;
  cover: Maybe<File>;
  thumbnail: Maybe<File>;
  url_facebook: Maybe<string>;
  url_twitter: Maybe<string>;
  url_instagram: Maybe<string>;
  url_linkedin: Maybe<string>;
  got_children: boolean;
}

export interface Province {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  users: User[];
  cities: City[];
  city_id: Maybe<string>;
  district_id: Maybe<string>;
}

export interface City {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  province: Maybe<Province>;
  district_id: Maybe<string>;
  users: User[];
  districts: District[];
}

export interface District {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  city: Maybe<City>;
  city_id: Maybe<string>;
  users: User[];
}

export interface File {
  id: string;
  user: Maybe<User>;
  name: string;
  mime: string;
  path: string;
  created_at: string;
  updated_at: string;
  user_id: Maybe<string>;
  fileable: Maybe<Fileable>;
}

export type Fileable = Video;
export interface YoutubeStatistic {
  viewCount: Maybe<string>;
  likeCount: Maybe<string>;
  dislikeCount: Maybe<string>;
  favoriteCount: Maybe<string>;
  commentCount: Maybe<string>;
}

export interface YoutubeMetadata {
  duration: Maybe<string>;
  dimension: Maybe<string>;
  definition: Maybe<string>;
  caption: Maybe<boolean>;
  licensedContent: Maybe<boolean>;
  contentRating: Maybe<string[]>;
  projection: Maybe<string>;
  duration_sec: Maybe<number>;
  thumbnail: Maybe<ThumnailYoutubeMap>;
}

export interface ThumnailYoutubeMap {
  default: Maybe<string>;
  mqDefault: Maybe<string>;
  hqDefault: Maybe<string>;
  sdDefault: Maybe<string>;
  maxresDefault: Maybe<string>;
}

export interface Page {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  route: string;
  data: string;
}

export interface Classroom {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  description: Maybe<string>;
  rejected_reason: Maybe<string>;
  address: string;
  status: ClassroomStatus;
  begin_at: Maybe<string>;
  finish_at: Maybe<string>;
  max_trainer: number;
  max_join: number;
  trainer_full: boolean;
  participant_full: boolean;
  joined: boolean;
  participantsCount: number;
  trainersCount: number;
  user: Maybe<User>;
  province: Maybe<Province>;
  district: Maybe<District>;
  city: Maybe<City>;
  province_id: Maybe<string>;
  city_id: Maybe<string>;
  district_id: Maybe<string>;
  user_id: Maybe<string>;
  trainers: User[];
  participants: User[];
  thumbnail: Maybe<File>;
  cover: Maybe<File>;
  map: Maybe<File>;
}

export enum ClassroomStatus {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED",
}
export enum Roles {
  Member = "MEMBER",
  Trainer = "TRAINER",
  Admin = "ADMIN",
}
/** A paginated list of User edges. */
export interface UserConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of User edges.*/
  edges: UserEdge[];
}

/** Information about pagination using a Relay style cursor connection. */
export interface PageInfo {
  /** When paginating forwards, are there more items?*/
  hasNextPage: boolean;
  /** When paginating backwards, are there more items?*/
  hasPreviousPage: boolean;
  /** The cursor to continue paginating backwards.*/
  startCursor: Maybe<string>;
  /** The cursor to continue paginating forwards.*/
  endCursor: Maybe<string>;
  /** Total number of nodes in the paginated connection.*/
  total: number;
  /** Number of nodes in the current page.*/
  count: number;
  /** Index of the current page.*/
  currentPage: number;
  /** Index of the last available page.*/
  lastPage: number;
}

/** An edge that contains a node of type User and a cursor. */
export interface UserEdge {
  /** The User node.*/
  node: User;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Page edges. */
export interface PageConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Page edges.*/
  edges: PageEdge[];
}

/** An edge that contains a node of type Page and a cursor. */
export interface PageEdge {
  /** The Page node.*/
  node: Page;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** The available directions for ordering a list of records. */
export enum SortOrder {
  Asc = "ASC",
  Desc = "DESC",
}
/** A paginated list of Classroom edges. */
export interface ClassroomConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Classroom edges.*/
  edges: ClassroomEdge[];
}

/** An edge that contains a node of type Classroom and a cursor. */
export interface ClassroomEdge {
  /** The Classroom node.*/
  node: Classroom;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

export enum VideoType {
  Youtube = "YOUTUBE",
  Path = "PATH",
}
/** A paginated list of Video edges. */
export interface VideoConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Video edges.*/
  edges: VideoEdge[];
}

/** An edge that contains a node of type Video and a cursor. */
export interface VideoEdge {
  /** The Video node.*/
  node: Video;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

/** A paginated list of Comment edges. */
export interface CommentConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Comment edges.*/
  edges: CommentEdge[];
}

/** An edge that contains a node of type Comment and a cursor. */
export interface CommentEdge {
  /** The Comment node.*/
  node: Comment;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

export interface Comment {
  id: string;
  user: Maybe<User>;
  content: string;
  created_at: string;
  updated_at: string;
  commentable: Maybe<Commentable>;
}

export type Commentable = Video;
/** A paginated list of Like edges. */
export interface LikeConnection {
  /** Pagination information about the list of edges.*/
  pageInfo: PageInfo;
  /** A list of Like edges.*/
  edges: LikeEdge[];
}

/** An edge that contains a node of type Like and a cursor. */
export interface LikeEdge {
  /** The Like node.*/
  node: Like;
  /** A unique cursor that can be used for pagination.*/
  cursor: string;
}

export interface Like {
  id: string;
  user: Maybe<User>;
  user_id: Maybe<string>;
  type: string;
  created_at: string;
  updated_at: string;
  likeable: Maybe<Likeable>;
}

export type Likeable = Video;
export interface Login {
  password?: string;
  email?: string;
}

export interface AuthOutput {
  status: boolean;
  message: Maybe<string>;
  token: Maybe<string>;
  user: Maybe<User>;
}

export interface Register {
  name?: string;
  username?: string;
  password?: string;
  email?: string;
  parent_id?: string;
  title?: string;
  subscription_type?: string;
  description?: string;
  metadata?: string;
  province_id?: string;
  district_id?: string;
  city_id?: string;
  classroom_id?: string;
}

export interface BasicOutput {
  status: boolean;
  message: Maybe<string>;
}

export interface UploadFile {
  name?: string;
  mime?: string;
  file?: File;
  fileable_id?: string;
  fileable_type?: string;
  roles?: string;
}

export interface BasicOutputFile {
  status: boolean;
  message: Maybe<string>;
  file: Maybe<File>;
}

export interface UpdateUser {
  name?: string;
  username?: string;
  title?: string;
  subscription_type?: SubscriptionUserType;
  roles?: Roles;
  is_admin?: boolean;
  description?: string;
  is_banned?: boolean;
  banned_reason?: string;
  metadata?: string;
  province_id?: string;
  district_id?: string;
  city_id?: string;
  url_facebook?: string;
  url_twitter?: string;
  url_instagram?: string;
  url_linkedin?: string;
}

export interface CreateUser {
  name?: string;
  username?: string;
  password?: string;
  subscription_type?: SubscriptionUserType;
  description?: string;
  metadata?: string;
  roles?: string;
  email?: string;
  province_id?: string;
  district_id?: string;
  city_id?: string;
}

export interface UpdatePassword {
  old_password?: string;
  new_password?: string;
}

export interface CreatePage {
  name: string;
  route: string;
  data?: string;
}

export interface UpdatePage {
  name?: string;
  route?: string;
  data?: string;
}

export interface CreateClassroom {
  description?: string;
  rejected_reason?: string;
  name?: string;
  address?: string;
  begin_at?: string;
  finish_at?: string;
  max_trainer?: string;
  max_join?: string;
  province_id?: string;
  district_id?: string;
  city_id?: string;
  user_id?: string;
}

export interface UpdateClassroom {
  description?: string;
  rejected_reason?: string;
  name?: string;
  address?: string;
  status?: ClassroomStatus;
  begin_at?: string;
  finish_at?: string;
  max_trainer?: number;
  max_join?: number;
  province_id?: string;
  district_id?: string;
  city_id?: string;
}

export interface CreateVideo {
  name?: string;
  youtube_id?: string;
}

export interface UpdateVideo {
  name?: string;
  youtube_id?: string;
}

export interface CreateComment {
  content?: string;
}

export interface UpdateComment {
  content?: string;
}

export interface CreateCategory {
  name?: string;
}

export interface UpdateCategory {
  name?: string;
}

export interface CreateLike {
  type?: string;
}

export interface BasicNotificationMetadata {
  content: Maybe<string>;
}

export interface BasicNotification {
  id: string;
  name: string;
  text: string;
  user: User;
  read_at: Maybe<string>;
  metadata: Maybe<BasicNotificationMetadata>;
  created_at: string;
  updated_at: string;
  user_id: Maybe<string>;
}

export interface CreateBasicNotification {
  name?: string;
  text?: string;
  user_id?: string;
  metadata?: string;
}

export interface UpdateBasicNotification {
  name?: string;
  text?: string;
  read_at?: string;
  metadata?: string;
}

/** Allows ordering a list of records. */
export interface OrderByClause {
  /** The column that is used for ordering.*/
  column: string;
  /** The direction that is used for ordering.*/
  order: SortOrder;
}

/** Information about pagination using a fully featured paginator. */
export interface PaginatorInfo {
  /** Number of items in the current page.*/
  count: number;
  /** Index of the current page.*/
  currentPage: number;
  /** Index of the first item in the current page.*/
  firstItem: Maybe<number>;
  /** Are there more pages after this one?*/
  hasMorePages: boolean;
  /** Index of the last item in the current page.*/
  lastItem: Maybe<number>;
  /** Index of the last available page.*/
  lastPage: number;
  /** Number of items per page.*/
  perPage: number;
  /** Number of total available items.*/
  total: number;
}

/** Information about pagination using a simple paginator. */
export interface SimplePaginatorInfo {
  /** Number of items in the current page.*/
  count: number;
  /** Index of the current page.*/
  currentPage: number;
  /** Index of the first item in the current page.*/
  firstItem: Maybe<number>;
  /** Index of the last item in the current page.*/
  lastItem: Maybe<number>;
  /** Number of items per page.*/
  perPage: number;
}

/** Specify if you want to include or exclude trashed results from a query. */
export enum Trashed {
  Only = "ONLY",
  With = "WITH",
  Without = "WITHOUT",
}
export interface categoriesArgs {}

export interface userArgs {
  id?: string;
}

export interface provincesArgs {}

export interface citiesArgs {
  province_id: string;
}

export interface districtsArgs {
  city_id: string;
}

export interface pageArgs {
  id: string;
}

export interface videoArgs {
  id: string;
}

export interface classroomArgs {
  id: string;
}

export interface usersArgs {
  name?: string;
  province_id?: string;
  city_id?: string;
  district_id?: string;
  parent_id?: string;
  is_banned?: boolean;
  roles?: Roles;
  subscription_type?: SubscriptionUserType;
  email?: string;
  is_admin?: boolean;
  got_children?: boolean;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface parentCandidateArgs {
  name?: string;
  province_id?: string;
  city_id?: string;
  district_id?: string;
  parent_id?: string;
  roles?: Roles;
  got_children?: boolean;
  classroom_id?: string;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface pagesArgs {
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface classroomsArgs {
  orderBy?: QueryClassroomsOrderByOrderByClause[];
  name?: string;
  user_id?: string;
  province_id?: string;
  city_id?: string;
  district_id?: string;
  participant_id?: string;
  trainer_id?: string;
  active?: boolean;
  hasSlot?: boolean;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface videosArgs {
  orderBy?: QueryVideosOrderByOrderByClause[];
  name?: string;
  user_id?: string;
  category_id?: string;
  type?: VideoType;
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface commentsArgs {
  user_id?: string;
  orderBy?: QueryCommentsOrderByOrderByClause[];
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface likesArgs {
  user_id?: string;
  orderBy?: QueryLikesOrderByOrderByClause[];
  /** Limits number of fetched items.*/
  first: number;
  /** A cursor after which elements are returned.*/
  after?: string;
}

export interface loginArgs {
  input: Login;
}

export interface registerArgs {
  input: Register;
}

export interface resetTrainerClassroomArgs {
  classroom_id: string;
}

export interface handleJoinclassroomArgs {
  classroom_id: string;
}

export interface uploadFileArgs {
  input: UploadFile;
}

export interface updateUserArgs {
  id: string;
  input: UpdateUser;
}

export interface createUserArgs {
  input: CreateUser;
}

export interface updatePasswordArgs {
  input: UpdatePassword;
}

export interface createPageArgs {
  input: CreatePage;
}

export interface updatePageArgs {
  id: string;
  input: UpdatePage;
}

export interface createClassroomArgs {
  input: CreateClassroom;
}

export interface updateClassroomArgs {
  id: string;
  input: UpdateClassroom;
}

export interface createVideoArgs {
  input: CreateVideo;
}

export interface updateVideoArgs {
  id: string;
  input: UpdateVideo;
}

export interface createCommentArgs {
  input: CreateComment;
}

export interface UpdateCommentArgs {
  id: string;
  input: UpdateComment;
}

export interface createCategoryArgs {
  input: CreateCategory;
}

export interface updateCategoryArgs {
  input: UpdateCategory;
}

export interface deleteDistrictArgs {
  id: string;
}

export interface deleteCityArgs {
  id: string;
}

export interface deleteProvinceArgs {
  id: string;
}

export interface deletePageArgs {
  id: string;
}

export interface deleteClassroomArgs {
  id: string;
}

export interface deleteVideoArgs {
  id: string;
}

export interface deleteCommentArgs {
  id: string;
}

export interface deleteLikeArgs {
  id: string;
}

export interface deleteFileArgs {
  id: string;
}

export interface deleteCategoryArgs {
  id: string;
}

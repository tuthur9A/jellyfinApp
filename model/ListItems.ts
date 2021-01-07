export interface Itemlist<TDataType> {
    TotalRecordCount: number,
    StartIndex: number,
    Items: TDataType[];
  }

export interface MovieModel {
    Name: string,
    BackdropImageTags: string[],
    Id: string,
    UserData: UserDataModel
}

export interface UserDataModel {
  IsFavorite: boolean,
  Key: string,
  LastPlayedDate: string,
  PlayCount: number,
  PlaybackPositionTicks: number,
  Played: boolean
  PlayedPercentage: number
}
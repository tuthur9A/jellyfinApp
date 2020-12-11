export interface Itemlist<TDataType> {
    TotalRecordCount: number,
    StartIndex: number,
    Items: TDataType[];
  }

export interface MovieModel {
    Name: string,
    BackdropImageTags: string[],
    Id: string
}
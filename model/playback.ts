export interface PlaybackModel {
    MediaSources: MediaSourceModel[],
    PlaySessionId: string
}

export interface MediaSourceModel {
    Protocol?: string,
    Id: string,
    Path?: string,
    Type?: string,
    Container: string,
    Size: number,
    Name: string,
    IsRemote: boolean,
    ETag?: string,
    RunTimeTicks?: number,
    ReadAtNativeFramerate?: boolean,
    IgnoreDts?: boolean,
    IgnoreIndex?: boolean,
    GenPtsInput?: boolean,
    SupportsTranscoding?: boolean,
    SupportsDirectStream?: boolean,
    SupportsDirectPlay?: boolean,
    IsInfiniteStream?: boolean,
    RequiresOpening?: boolean,
    RequiresClosing?: boolean,
    RequiresLooping?: boolean,
    SupportsProbing?: boolean,
    VideoType?: string,
    MediaStreams?: MediatStreamModel[],
    MediaAttachments?: MediaAttachements[],
    Formats?: string[],
    Bitrate?: number,
    RequiredHttpHeaders?: RequiredHttpHeadersModel
    DefaultAudioStreamIndex?: number
}

export interface RequiredHttpHeadersModel {
    [key: string]: string;
}
export interface MediaAttachements {
    Codec?: string | null;
    CodecTag?: string | null;
    Comment?: string | null;
    Index?: number;
    FileName?: string | null;
    MimeType?: string | null;
    DeliveryUrl?: string | null;
}

export interface MediatStreamModel {
    Codec: string,
    CodecTag: string,
    Language: string,
    TimeBase: string,
    CodecTimeBase: string,
    VideoRange: string,
    DisplayTitle: string,
    NalLengthSize: string,
    IsInterlaced: boolean,
    IsAVC: boolean,
    BitRate: number,
    BitDepth: number,
    RefFrames: number,
    IsDefault: boolean,
    IsForced: boolean,
    Height: number,
    Width: number,
    AverageFrameRate: number,
    RealFrameRate: number,
    Profile: string,
    Type: string,
    AspectRatio: string,
    Index: number,
    IsExternal: boolean,
    IsTextSubtitleStream: boolean,
    SupportsExternalStream: boolean,
    PixelFormat: string,
    Level: number
}
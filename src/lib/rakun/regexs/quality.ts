/**
 * Quality related regexs (sources, resolution, codecs, etc.)
 */
export default {

    //Codecs
    codecs: [
        /(?<x264>[Xx]264)/,
        /(?<h264>[Hh]264)/,
        /(?<x265>[Xx]265)/,
        /(?<x265>[(\[-_. ][Xx]265[)\]-_. ])/,
        /(?<h265>[Hh]265)/,
        /(?<hi444pp>Hi444PP)/,
        /(?<xvidhd>XVIDHD)/,
        /(?<divx>divx)/,
        /(?<eac3>E-?AC-?3)/,
        /(?<aac>AAC)/,
        /(?<ac3>[Aa]c3|AC3)/,
        /(?<yuv444p10>YUV444P10)/,
        /(?<av1>AV1)/,
        /(?<flac>FLAC(?:x2)?)/,
        /[-_. ]?(?<flac>FLAC)[-_. ]?/,
        /(?<flac>Flac)/,
        /(?<_10bit>10[-._ ]?[Bb]its?)/,
        /[_.-]?(?<_10bit>10bpp)[_.-]?/,
        /(?<_10bit>H[iI]10P)/,
        /(?<_10bit>H[iI]10)/,
        /(?<_8bit>8[-._ ]?bits?)/,
        /(?<hevc>hevc)/,
        /(?<hevc>HEVC)/,
        /(?<hevc>[(\[-_. ]HEVC[)\]-_. ])/,
        /(?<dual_audio>\bDual[-_. ]Audio\b)/,
        /(?<dual_audio>\bDUAL[-._ ]AUD[Ii]O\b)/,
        /(?<dts_hdma>\bDTSHDMA?\b)/,
        /(?<dts_hdma>\bDTS-?HD[-_. ]?MA(?:[-_. ]6.1)?\b)/,
        /[-_. ]?(?<avc>AVC)[-_. ]?/,
        /(?<audio_5_1>\b(?:DD)?5\.1\b)/,
        /(?<dts>\bDTS\b)/,
        /(?<true_hd>\bTrueHD\b)/,
        /(?<lpcm>\bLPCM\b)/,
    ],

    //Distributors
    distributor: [
        /(?<apple_tv>\bATVP\b)/,
        /(?<amazon>\bAMZN-DL\b)/,
        /(?<amazon>\bAMZN\b)/,
        /(?<comedy_central>\bCC\b)/,
        /(?<crunchy_roll>\bCR\b)/,
        /(?<disney>\bDSNP\b)/,
        /(?<disney>\bDSNY\b)/,
        /(?<fox>\bFOX\b)/,
        /(?<hulu>\bHULU\b)/,
        /(?<disney>\bDSNY\b)/,
        /(?<mtv>\bMTV\b)/,
        /(?<netflix>\bNF\b)/,
        /(?<tf1>\bTF1\b)/,
        /(?<bs11>\bBS11\b)/,
        /(?<tv_asahi>\bTV Asahi\b)/,
        /(?<tokyo_tv>\bTokyo TV\b)/,
        /(?<at_x>AT-[Xx])/,
    ],

    //Resolutions
    resolution: [
        /(?:HD\s?)?(?<_1080p>1080[Pp])(?:\s?HD)?/,
        /(?<_1080p>1920x1080)/,
        /(?:HD\s?)?(?<_720p>720[Pp])(?:\s?HD)?/,
        /(?<_720p>1280x720)/,
        /(?<_480p>480[Pp])/,
        /(?<_480p>640x480)/,
        /(?<_480p>848x480)/,
        /(?<_576p>576[Pp])/,
        /(?<_544p>544[Pp])/,
        /(?<_540p>540[Pp])/,
        /(?<_2160p>2160[Pp])/,
        /(?<_4K>4[Kk])/,
        /(?<_16_9>720x480|768x576)/,
    ],

    //Sources
    source: [
        /(?<bluray>[Bb]lu-?[Rr]ay (?:RIP|[Rr]ip))/,
        /(?<bluray>BD(?:RIP|[Rr]ip))/,
        /(?<bluray>BR(?:RIP|[Rr]ip))/,
        /(?<=[^A-Za-z])(?<bluray>B[RD])(?=[^A-Za-z])/,
        /(?<bluray>BLU-?RAY)/,
        /(?<bluray>[Bb]lu-?[Rr]ay)(?!\w)/,
        /(?<bluray>HD-?DVD)/,
        /(?<bluray>BD(?=REMUX))/,
        /(?<webdl>WEB[-_. ]?DL)/,
        /(?<webdl>WEB-?R[Ii][Pp])/,
        /(?<webdl>WEBHD)/,
        /(?<webdl>\bONA\b)/,
        /(?<dvd>DVDR[Ii][Pp])/,
        /(?<dvd>[Dd]vd\s?[Rr]ip)/,
        /(?<dvd>DVD)/,
        /(?<dvd>\bNTSC\b)/,
        /(?<dvd>\bPAL\b)/,
        /(?<dvd>XVIDDVD)/,
        /(?<dd>\bDD\b)/,
        /(?<dsr>\bWS[-_. ]DSR\b)/,
        /(?<dsr>\bDSR\b)/,
        /(?<hdtv>HDTV)/,
        /(?<pdtv>PDTV)/,
        /(?<sdtv>SDTV)/,
        /(?<tvrip>TVRIP)/,
        /(?<tvrip>TV[-_. ]?[Rr]ip)/,
        /(?<camrip>CAM[-_. ]?RIP)/,
        /(?<raw>\bRAW\b)/,
    ],

}
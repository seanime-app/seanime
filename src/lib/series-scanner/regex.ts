export const ANIDB_RX = [
    /(^|(?<show>.*?)[ _\.\-(]+)(SP|SPECIAL|OAV|OVA) ?(?<ep>\d{1,2})(-(?<ep2>[0-9]{1,3}))? ?(?<title>.*)$/i,                                                //   #  5 # 001-099 Specials
    /(^|(?<show>.*?)[ _\.\-(]+)(OP|NCOP|OPENING) ?(?<ep>\d{1,2}[a-z]?)? ?(v2|v3|v4|v5)?([ _\.\-)]+(?<title>.*))?$/i,                                     //   #  6 # 100-149 Openings
    /(^|(?<show>.*?)[ _\.\-(]+)(ED|NCED|ENDING) ?(?<ep>\d{1,2}[a-z]?)? ?(v2|v3|v4|v5)?([ _\.\-)]+(?<title>.*))?$/i,                                      //   #  7 # 150-199 Endings
    /(^|(?<show>.*?)[ _\.\-(]+)(TRAILER|PROMO|PV|T) ?(?<ep>\d{1,2}) ?(v2|v3|v4|v5)?([ _\.\-)]+(?<title>.*))?$/i,                                         //   #  8 # 200-299 Trailer, Promo with a  number  '(^|(?<show>.*?)[ _\.\-]+)((?<=E)P|PARODY|PARODIES?) ?(?<ep>\d{1,2})? ?(v2|v3|v4|v5)?(?<title>.*)$',                                                                        # 10 # 300-399 Parodies
    /(^|(?<show>.*?)[ _\.\-(]+)(O|OTHERS?)(?<ep>\d{1,2}) ?(v2|v3|v4|v5)?[ _\.\-)]+(?<title>.*)$/i,                                                       //   #  9 # 400-499 Others
    /[-._ ][Ss](?<season>(0|00))(?=[Ee]\d)/i,
    /[-._ ](OVA)[-._ ]/,
    /(^|(?<show>.*?)[ _\.\-(]+)(e|ep|e |ep |e-|ep-)?(?<ep>[0-9]{1,3})((e|ep|-e|-ep|-)(?<ep2>[0-9]{1,3})|)? ?(v2|v3|v4|v5)?([ _\.\-]+(?<title>.*))?$/, //   # 10 # E01 | E01-02| E01-E02 | E01E02                                                                                                                       # __ # look behind: (?<=S) < position < look forward: (?!S)
    /(^|(?<show>.*?)[ _\.\-(]+)S ?(?<ep>\d{1,2}) ?(?<title>.*)$/i,
]

export const SERIES_RX = [                                                                                                                                                  //         ######### Series regex - "serie - xxx - title" ###
    /(^|(?<show>.*?)[ _\.\-]+)(?<season>[0-9]{1,2})[Xx](?<ep>[0-9]{1,3})((|[_\-][0-9]{1,2})[Xx](?<ep2>[0-9]{1,3}))?([ _\.\-]+(?<title>.*))?$/i,                       //#  0 # 1x01
    /(^|(?<show>.*?)[ _\.\-]+)s(?<season>[0-9]{1,2})(e| e|ep| ep|-)(?<ep>[0-9]{1,3})(([ _\.\-]|(e|ep)|[ _\.\-](e|ep))(?<ep2>[0-9]{1,3}))?($|( | - |)(?<title>.*?)$)/i,//#  1 # s01e01-02
    /(^|(?<show>.*?)[ _\.\-]+)(?<ep>[0-9]{1,3})[ _\.\-]?of[ _\.\-]?[0-9]{1,3}([ _\.\-]+(?<title>.*?))?$/i,                                                              //#  2 # 01 of 08 (no stacking for this one ?)
    /^(?<show>.*?) - (E|e|Ep|ep|EP)?(?<ep>[0-9]{1,3})(-(?<ep2>[0-9]{1,3}))?( - )?(?<title>.*)$/i,                                                                      //#  3 # Serie - xx - title.ext | ep01-ep02 | e01-02
    /^(?<show>.*?) \[(?<season>[0-9]{1,2})\] \[(?<ep>[0-9]{1,3})\] (?<title>.*)$/i,
]
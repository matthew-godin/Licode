INSERT INTO questions(question, function_signature, default_custom_input, input_output_format, test_cases)
VALUES ('You are given an array of distinct strictly positive integers $distinctIntegers$ and a strictly positive integer $arrangementSum$. Return an array of arrays where each subarray contains integers in $integers$ (integer itslef, not its index) adding up to $arrangementSum$.;'
    'The same integer in $integers$ can be taken more than once in a given subarray. The returned array must contain all possible subarrays that have a sum of their elements adding up to $arrangementSum$.;'
    'The integers in the subarrays and the subarrays can be returned in any order.', 'def arrangementSumPossibleIntegers(integers, arrangementSum):', '[1,2,3];4', '2;a;n|1;aa',
    '3;1;2;3;4|'
    '2;1;5;5|'
    '4;1;4;5;6;1'
    '30;16;20;17;29;1;3;10;23;14;4;11;2;5;13;8;18;30;7;15;22;12;27;25;24;9;6;21;28;26;19;9|'
    '19;35;85;6;90;100;46;14;67;98;91;47;16;5;88;44;4;20;49;56;51|'
    '4;3;4;1;2;11|'
    '8;13;6;25;22;1;18;21;4;22|'
    '4;19;3;15;8;54|'
    '3;1;16;17;41|'
    '2;10;157;499|'
    '29;141;69;91;78;156;62;38;131;89;144;170;145;127;16;136;55;32;112;121;184;123;191;93;77;67;160;164;162;99;162|'
    '4;4;1;1;1;1;3;1;1;2;2;1;3;2;2;2|'
    '2;5;1;1;1;1;1;1;5|'
    '1;1;1|'
    '30;9;1;1;1;1;1;1;1;1;1;8;1;1;1;1;1;1;1;2;7;1;1;1;1;1;1;3;6;1;1;1;1;1;4;7;1;1;1;1;1;2;2;6;1;1;1;1;3;2;5;1;1;1;1;5;5;1;1;1;3;3;5;1;1;1;4;2;6;1;1;1;2;2;2;4;1;1;1;6;4;1;1;3;4;5;1;1;3;2;2;4;1;1;2;5;3;1;1;7;4;1;3;3;2;3;1;3;5;3;1;4;4;4;1;4;2;2;5;1;2;2;2;2;3;1;2;6;2;1;8;3;3;3;3;3;3;4;2;4;3;2;2;2;2;3;6;2;4;5;3;2;2;5;2;2;7;1;9|'
    '53;12;4;4;4;4;4;4;4;4;4;4;5;6;12;4;4;4;4;4;4;4;4;4;5;5;5;10;4;4;4;4;4;4;4;4;5;14;11;4;4;4;4;4;4;4;5;6;6;6;11;4;4;4;4;4;4;5;5;5;6;6;9;4;4;4;4;4;4;5;6;16;11;4;4;4;4;4;5;5;5;5;5;6;9;4;4;4;4;4;5;5;5;16;9;4;4;4;4;4;5;6;6;14;8;4;4;4;4;4;5;6;20;11;4;4;4;4;5;5;5;5;5;5;5;9;4;4;4;4;5;5;5;6;14;8;4;4;4;4;5;5;5;20;10;4;4;4;4;5;6;6;6;6;6;7;4;4;4;4;5;14;16;5;4;4;4;4;35;9;4;4;4;5;5;5;5;5;14;10;4;4;4;5;5;5;6;6;6;6;8;4;4;4;5;6;6;6;16;7;4;4;4;5;6;14;14;6;4;4;4;5;14;20;10;4;4;5;5;5;5;5;6;6;6;8;4;4;5;5;5;6;6;16;7;4;4;5;5;5;14;14;8;4;4;5;6;6;6;6;14;7;4;4;5;6;6;6;20;6;4;4;5;6;16;16;10;4;5;5;5;5;5;5;5;6;6;8;4;5;5;5;5;5;6;16;8;4;5;5;5;6;6;6;14;7;4;5;5;5;6;6;20;6;4;5;5;5;16;16;9;4;5;6;6;6;6;6;6;6;6;4;5;6;6;14;16;5;4;5;6;16;20;5;4;5;14;14;14;4;4;6;6;35;2;4;47;10;5;5;5;5;5;5;5;5;5;6;8;5;5;5;5;5;5;5;16;8;5;5;5;5;5;6;6;14;7;5;5;5;5;5;6;20;9;5;5;5;6;6;6;6;6;6;6;5;5;5;6;14;16;5;5;5;5;16;20;4;5;5;6;35;7;5;6;6;6;6;6;16;6;5;6;6;6;14;14;5;5;6;6;14;20;4;5;6;20;20;4;5;14;16;16;2;5;46;2;16;35|'
    '27;11;1;1;1;1;1;1;1;1;1;1;1;10;1;1;1;1;1;1;1;1;1;2;9;1;1;1;1;1;1;1;1;3;9;1;1;1;1;1;1;1;2;2;8;1;1;1;1;1;1;1;4;8;1;1;1;1;1;1;2;3;8;1;1;1;1;1;2;2;2;7;1;1;1;1;1;2;4;7;1;1;1;1;1;3;3;7;1;1;1;1;2;2;3;6;1;1;1;1;3;4;7;1;1;1;2;2;2;2;6;1;1;1;2;2;4;6;1;1;1;2;3;3;5;1;1;1;4;4;6;1;1;2;2;2;3;5;1;1;2;3;4;5;1;1;3;3;3;6;1;2;2;2;2;2;5;1;2;2;2;4;5;1;2;2;3;3;4;1;2;4;4;4;1;3;3;4;5;2;2;2;2;3;4;2;2;3;4;4;2;3;3;3;3;3;4;4|'
    '24;22;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;19;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;4;17;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;6;16;1;1;1;1;1;1;1;1;1;1;1;1;1;1;4;4;14;1;1;1;1;1;1;1;1;1;1;1;1;4;6;13;1;1;1;1;1;1;1;1;1;1;4;4;4;12;1;1;1;1;1;1;1;1;1;1;6;6;10;1;1;1;1;1;1;1;1;1;13;11;1;1;1;1;1;1;1;1;4;4;6;10;1;1;1;1;1;1;4;4;4;4;9;1;1;1;1;1;1;4;6;6;7;1;1;1;1;1;4;13;8;1;1;1;1;4;4;4;6;7;1;1;1;1;6;6;6;5;1;1;1;1;18;5;1;1;1;6;13;7;1;1;4;4;4;4;4;6;1;1;4;4;6;6;4;1;4;4;13;2;1;21;5;4;4;4;4;6;4;4;6;6;6;2;4;18;1;22|'
    '12;18;3;3;3;3;3;3;3;3;3;3;3;3;3;3;3;3;3;3;14;3;3;3;3;3;3;3;3;3;3;3;3;3;15;13;3;3;3;3;3;3;3;3;3;3;8;8;8;11;3;3;3;3;3;3;3;3;3;8;19;10;3;3;3;3;3;3;3;3;15;15;9;3;3;3;3;3;8;8;8;15;7;3;3;3;3;8;15;19;6;3;3;3;15;15;15;8;3;3;8;8;8;8;8;8;6;3;8;8;8;8;19;5;8;8;8;15;15;4;8;8;19;19|'
    '6;41;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;26;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;16;25;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1;17;11;1;1;1;1;1;1;1;1;1;16;16;10;1;1;1;1;1;1;1;1;16;17;9;1;1;1;1;1;1;1;17;17|'
    '0|'
    '8;6;16;16;16;38;38;38;5;16;32;38;38;38;3;16;55;91;3;16;69;77;3;38;55;69;3;38;62;62;2;69;93;1;162|'
);
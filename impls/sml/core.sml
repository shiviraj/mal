exception NotDefined of string
exception NotApplicable of string

val coreList = [
    SYMBOL "list",
    FN (fn args => LIST args),

    SYMBOL "list?",
    FN (fn [LIST _] => BOOL true
         | [_]      => BOOL false
         | _        => raise NotApplicable "list? requires one argument"),

    SYMBOL "empty?",
    FN (fn [LIST []] => BOOL true
         | [LIST _]  => BOOL false
         | _         => raise NotApplicable "empty? requires a list"),

    SYMBOL "count",
    FN (fn [LIST l] => INT (length l)
         | [NIL]    => INT 0
         | _        => raise NotApplicable "count requires a list")
]

val coreIo = [
    SYMBOL "prn",
    FN (fn [x] => (TextIO.print ((prStr x) ^ "\n"); NIL)
         | _   => raise NotApplicable "'prn' requires one argument")
]

fun arithFolder n f (INT next, INT prev) = INT (f (prev, next))
  | arithFolder n _ _                    = raise NotApplicable ("'" ^ n ^ "' requires integer arguments")

fun cmpFolder n c (INT next, (INT prev, acc)) = (INT next, acc andalso (c (prev, next)))
  | cmpFolder n _ _                           = raise NotApplicable ("'" ^ n ^ "' requires integer arguments")

fun cmpFold n c (x::xs) = foldl (cmpFolder n c) (x, true) xs |> #2 |> BOOL
  | cmpFold n _ _       = raise NotApplicable ("'" ^ n ^ "' requires arguments")

fun eqFolder (next, (prev, acc)) = (next, acc andalso (malEq (next, prev)))

val coreCmp = [
    SYMBOL "=", 
    FN (fn (x::xs) => foldl eqFolder (x, true) xs |> #2 |> BOOL
         | _       => raise NotApplicable "'=' requires arguments"),

    SYMBOL "<",  FN (cmpFold "<" (op <)),
    SYMBOL "<=", FN (cmpFold "<=" (op <=)),
    SYMBOL ">=", FN (cmpFold ">=" (op >=)),
    SYMBOL ">",  FN (cmpFold ">" (op >))
]

val coreMath = [
    SYMBOL "+", FN (fn args => foldl (arithFolder "+" (op +)) (INT 0) args),
    SYMBOL "*", FN (fn args => foldl (arithFolder "*" (op * )) (INT 1) args),
    SYMBOL "/", FN (fn (x::xs) => foldl (arithFolder "/" (op div)) x xs
                      | _      => raise NotApplicable "'/' requires arguments"),
    SYMBOL "-", FN (fn (x::xs) => foldl (arithFolder "-" (op -)) x xs
                      | _      => raise NotApplicable "'-' requires arguments")
]

val coreNs = List.concat [
    coreList,
    coreIo,
    coreCmp,
    coreMath
]
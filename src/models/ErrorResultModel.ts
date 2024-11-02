export type ErrorResultModel = {
  errorsMessages: FieldError[]
};
export type FieldNamesType = string
type FieldError = { message: string, field: FieldNamesType }


// export const someController = (
//     req: Request<ParamType, OutputType, BodyType, QueryType>,
//     res: Response<OutputType>
// ) => {

// }
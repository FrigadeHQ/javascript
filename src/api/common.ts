import React, {useMemo} from "react";
import {FrigadeContext} from "../FrigadeProvider";

export const API_PREFIX = 'https://api.frigade.com/v1/public/';


export function useConfig() {
  const {publicApiKey, userId} = React.useContext(FrigadeContext);

  return {
    config: useMemo(
      () => ({
        headers: {
          Authorization: `Bearer ${publicApiKey}`,
          'Content-Type': 'application/json'
        }
      }),
      [publicApiKey, userId]
    )
  };
}

export interface PaginatedResult<T> {
  data: T[];
  offset: number;
  limit: number;
}

import type { AxiosInstance } from "axios";
import type { PollDto } from "~/dto/PollDto";

export const create = async(data: PollDto,authAxios: AxiosInstance) => {
    return authAxios.post(`/poll/save`,data);
}

export const get = async(data: string,authAxios: AxiosInstance) => {
    return authAxios.get(`/poll/${data}`);
}

export const getUsername = async(data: string,authAxios: AxiosInstance) => {
    return authAxios.get(`/poll/${data}/username`)
}

export const voteOption = async(data: number,authAxios: AxiosInstance) => {
    return authAxios.post(`/poll/vote/${data}`);
}

export const getAll = async(data:string,authAxios: AxiosInstance) => {
    return authAxios.get(`/poll/getAll?email=${data}`);
}
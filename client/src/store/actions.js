import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavoriteList, deleteFavoriteList } from 'common/js/cache'

function findIndex (list, song) {
  return list.findIndex(item => item.id === song.id)
}

export const selectPlay = ({ commit, state }, { list, index }) => {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    const randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = ({ commit }, { list }) => {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, shuffle(list))
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = ({ commit, state }, song) => {
  const playList = state.playList.slice(0)
  const sequenceList = state.sequenceList.slice(0)
  let currentIndex = state.currentIndex
  const currentSong = playList[currentIndex]

  // 查找当前列表中是否有待插入的歌曲并返回其索引
  const fpIndex = findIndex(playList, song)
  // 在当前播放索引的后面插入一首歌曲，所以索引加1
  currentIndex++
  // 插入歌曲到索引位置
  playList.splice(currentIndex, 0, song)
  // 如果播放列表中存在与插入歌曲相同的歌曲
  if (fpIndex > -1) {
    if (fpIndex > currentIndex) { // 插入的歌曲位于已存在歌曲的前面
      playList.splice(fpIndex + 1, 1)
    } else {
      playList.splice(fpIndex, 1)
      currentIndex-- // 因为在插入歌曲前面删除了一首歌，所以索引要减1
    }
  }

  // 处理正常排序的列表
  const fsIndex = findIndex(sequenceList, song)
  const currentSIndex = findIndex(sequenceList, currentSong) + 1
  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (fsIndex > currentSIndex) {
      sequenceList.splice(fpIndex + 1, 1)
    } else {
      sequenceList.splice(fpIndex, 1)
    }
  }
  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = ({ commit }, query) => {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = ({ commit }, query) => {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = ({ commit }) => {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = ({ commit, state }, song) => {
  const playList = state.playList.slice(0)
  const sequenceList = state.sequenceList.slice(0)
  let currentIndex = state.currentIndex
  const pIndex = findIndex(playList, song)
  playList.splice(pIndex, 1)
  const sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (pIndex < currentIndex || currentIndex === playList.length) {
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  const playingState = playList.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

export const clearSongList = ({ commit }) => {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = ({ commit }, song) => {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavorite = ({ commit }, song) => {
  commit(types.SET_FAVORITE_LIST, saveFavoriteList(song))
}

export const deleteFavorite = ({ commit }, song) => {
  commit(types.SET_FAVORITE_LIST, deleteFavoriteList(song))
}

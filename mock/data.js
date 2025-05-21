export default function generateMockData(count, type) {

  const mockTypes = {
    default: {
      titles: ['欢乐时光', '游戏分享', '技巧教学', '搞笑瞬间', '高手对决'],
      contents: ['今天玩得很开心！', '分享一个超好玩的游戏', '教你如何快速升级', '哈哈哈笑死我了', '这操作太秀了']
    },
    type1: {
      titles: ['电竞比赛', '团队合作', '单排日记', '新手上路', '装备展示'],
      contents: ['昨晚的比赛太精彩了', '和队友配合天衣无缝', '单排十连胜！', '新手求指导', '看看我的新装备']
    },
    type2: {
      titles: ['攻略分享', 'BUG发现', '皮肤展示', '赛事预告', '好友招募'],
      contents: ['最新关卡攻略', '发现一个有趣的BUG', '新皮肤太酷了', '周末有大型比赛', '寻找一起玩的小伙伴']
    }
  };

  const types = mockTypes[type] || mockTypes.default;
  const newPosts = [];



  for (let i = 0; i < count; i++) {
    const isVideo = Math.random() > 0.8;
    const titleIndex = Math.floor(Math.random() * types.titles.length);
    const contentIndex = Math.floor(Math.random() * types.contents.length);

    newPosts.push({
      id: Date.now() + i,
      title: types.titles[titleIndex],
      content: types.contents[contentIndex],
      media: isVideo
        ? `https://www.w3schools.com/html/mov_bbb.mp4`
        : `https://ww2.sinaimg.cn/mw690/005EUiO2ly1hxj8yk8u5oj30m81c37d9.jpg`,
      isVideo,
    });
  }

  return newPosts;
};
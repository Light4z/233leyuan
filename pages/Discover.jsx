import React, { useState, useEffect, useRef } from 'react';
import PostCard from '../components/PostCard.jsx'
import generateMockData from '../mock/data.js'
import './Discover.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);
  const columnsRef = useRef([[], []]);

  // 从URL获取参数
  const queryParams = new URLSearchParams(window.location.search);
  const dataType = queryParams.get('dataType') || 'default';


  // 加载数据
  const loadPosts = async (reset = false) => {
    if (loading || (!reset && !hasMore)) return;

    setLoading(true);

    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    const newPosts = generateMockData(10, dataType);

    if (reset) {
      setPosts(newPosts);
      setPage(2);
    } else {
      setPosts(prev => [...prev, ...newPosts]);
      setPage(prev => prev + 1);
    }

    // 模拟没有更多数据的情况
    if (page >= 5) {
      setHasMore(false);
    }

    setLoading(false);
  };

  // 初始化加载和重置列数据
  useEffect(() => {
    loadPosts(true);
    columnsRef.current = [[], []];
  }, [dataType]);

  // 处理滚动事件
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      if (isNearBottom && !loading && hasMore) {
        loadPosts();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [loading, hasMore]);

  // 处理下拉刷新
  const [startY, setStartY] = useState(null);
  const [pullDown, setPullDown] = useState(0);

  const handleTouchStart = (e) => {
    if (containerRef.current.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (startY === null) return;

    const y = e.touches[0].clientY;
    const diff = y - startY;

    if (diff > 0) {
      e.preventDefault();
      setPullDown(Math.min(diff, 100));
    }
  };

  const handleTouchEnd = () => {
    if (pullDown > 50) {
      setPullDown(50); // 保持加载状态
      loadPosts(true).then(() => {
        setTimeout(() => setPullDown(0), 500);
      });
    } else {
      setPullDown(0);
    }
    setStartY(null);
  };

  // 分配帖子到列
  const distributePostsToColumns = () => {
    const columns = [[], []];
    let heights = [0, 0];

    posts.forEach(post => {
      // 估算元素高度（图片/视频高度 + 固定内容高度）
      const mediaHeight = post.isVideo ? 200 : 300;
      const estimatedHeight = mediaHeight + 120;

      // 选择较矮的列
      const columnIndex = heights[0] <= heights[1] ? 0 : 1;

      columns[columnIndex].push(post);
      heights[columnIndex] += estimatedHeight;
    });

    return columns;
  };

  const columns = distributePostsToColumns();

  return (
    <div className="app">
      {/* 内容区域 */}
      <div
        className="content-container"
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 下拉刷新指示器 */}
        <div
          className="refresh-indicator"
          style={{ height: `${pullDown}px`, opacity: pullDown > 0 ? 1 : 0 }}
        >
          {pullDown > 50 ? '释放刷新...' : '下拉刷新...'}
        </div>

        {/* 瀑布流布局 */}
        <div className="masonry-container">
          <div className="masonry-column">
            {columns[0].map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="masonry-column">
            {columns[1].map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* 加载指示器 */}
        {loading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
          </div>
        )}

        {/* 没有更多数据提示 */}
        {!hasMore && (
          <div className="no-more-data">没有更多内容了</div>
        )}
      </div>
    </div>
  );
}



export default App;
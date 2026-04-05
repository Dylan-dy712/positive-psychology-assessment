import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft, FileText, Clock, Coins } from 'lucide-react';
import { getAssessmentById, assessments } from '../data/assessments';
import { clearAssessmentProgress, updateCoinBalance, getAssessmentRecords } from '../utils/storage';

const dimensionDescriptions: Record<string, Record<string, string>> = {
  ppq: {
    selfEfficacy: '面对高难度的专业课或重要的当众展示，你心里有多大底气觉得自己能Hold住全场？',
    resilience: '当遭遇考试挂科、比赛落选或人际摩擦的暴击时，你自我疗愈、重新站起来的速度有多快？',
    hope: '当原定计划（如考研/保研/留学）受阻，你能否迅速找出"Plan B（备用路线）"并为之行动？',
    optimism: '面对充满不确定的毕业与未来，你是不是总能捕捉到事物积极的一面，拒绝盲目焦虑？',
  },
  swls: {
    satisfaction: '不细分具体指标，纯粹依靠你的第一直觉，综合丈量你对当前自我状态、生活条件的接纳与满意水平。',
  },
  mlq: {
    presence: '你目前是否已经找到了那件让你觉得"人间值得"的事？（比如明确的职业梦想、热爱的爱好、想守护的人）。',
    search: '你现在有多渴望、有多主动地去跨出舒适区，去体验新事物，寻找属于自己的方向？',
  },
  skus: {
    knowledge: '你对自己性格里的高光点（如幽默、严谨、创意、领导力等），心里到底有多透彻？',
    usage: '在日常的小组作业、社团招新、宿舍交往中，你是不是能自然而然地运用这些优势为你加分？',
  },
  panas: {
    positive: '反映你最近的精力状态。是不是经常感到热情满满、备受鼓舞、自豪或者专注力爆表？',
    negative: '反映你最近的压力状态。是不是容易感到心烦意乱、害怕紧张，甚至因为拖延而感到深深的内疚？',
  },
  ashs: {
    agency: '面对阻碍，你内心那股"我偏要赢"、"我一定能搞定它"的内在意志力有多强？',
    pathway: '发现"此路不通"时，你能否马上想到去问学长学姐、找老师求助，或者换个切入点等替代方案？',
  },
  ers: {
    resilience: '不细分维度，整体评估你面对逆境、压力和惊吓时的自我调节能力、适应能力以及触底反弹的弹性特质。',
  },
  erq: {
    reappraisal: '你是否习惯通过改变对某件事的看法（比如把"失败"当成"攒人品/吸取经验"），来缓解负面情绪？',
    suppression: '你是否习惯在同学/老师面前刻意隐藏真实的感受，把所有的情绪都吞进肚子里不表达出来？',
  },
  rpws: {
    acceptance: '你能否坦然接受自己不够完美的成绩、容貌或原生家庭？',
    relationships: '你在学校里有没有能真正交心、彼此信任的高质量朋友？',
    environment: '你是否觉得自己能把宿舍生活、财务支出、学业安排得井井有条？',
    autonomy: '面对选修课、选专业或未来规划，你敢不敢坚持自己的想法，拒绝盲从？',
    purpose: '你觉得目前的校园生活是有奔头、有清晰方向感的吗？',
    growth: '抛开书本知识，你觉得自己作为一个"独立的大人"，还在不断挖掘自身潜能吗？',
  },
};

const dimensionDisplayNames: Record<string, Record<string, string>> = {
  ppq: {
    selfEfficacy: '自信力（自我效能感）',
    resilience: '复原力（韧性）',
    hope: '规划力（希望）',
    optimism: '向阳力（乐观）',
  },
  swls: {
    satisfaction: '主观生活满意度',
  },
  mlq: {
    presence: '拥有意义感（内心锚点）',
    search: '寻求意义感（探索渴望）',
  },
  skus: {
    knowledge: '优势知识（懂自己）',
    usage: '优势使用（用自己）',
  },
  panas: {
    positive: '积极情绪（能量值）',
    negative: '消极情绪（内耗值）',
  },
  ashs: {
    agency: '动力思维（引擎驱动）',
    pathway: '路径思维（导航路线）',
  },
  ers: {
    resilience: '自我心理韧性',
  },
  erq: {
    reappraisal: '认知重评（大脑转弯法）',
    suppression: '表达抑制（表情管理法）',
  },
  rpws: {
    acceptance: '自我接纳',
    relationships: '良好人际关系',
    environment: '环境控制',
    autonomy: '自主性',
    purpose: '生活目标',
    growth: '个人成长',
  },
};

// 检查用户当月是否已使用免费机会
const hasFreeMonthlyAssessment = (assessmentId: string): boolean => {
  if (!assessmentId || assessmentId === 'ppq') return true; // PPQ始终免费
  
  const assessment = assessments.find(a => a.id === assessmentId);
  if (!assessment || !assessment.freeMonthly) return false; // 无免费机会
  
  const records = getAssessmentRecords();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const thisMonthRecords = records.filter(record => {
    if (record.assessmentId !== assessmentId) return false;
    const recordDate = new Date(record.completedAt);
    return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
  });
  
  return thisMonthRecords.length === 0;
};

export const AssessmentIntroPage = () => {
  const navigate = useNavigate();
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const assessment = assessmentId ? getAssessmentById(assessmentId) : undefined;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);
  const [coinCost, setCoinCost] = useState(0);

  const handleBack = () => {
    navigate('/assessments');
  };

  // 获取价格显示文本
  const getPriceText = (): string => {
    if (!assessment) return '';
    if (assessment.id === 'ppq') {
      return '免费';
    }
    if (assessment.freeMonthly) {
      const hasFree = hasFreeMonthlyAssessment(assessment.id);
      if (hasFree) {
        return '本月首次免费';
      } else {
        return `${assessment.price}心理货币`;
      }
    }
    return `${assessment.price}心理货币`;
  };

  // 获取价格标签样式
  const getPriceStyle = (): string => {
    if (!assessment) return '';
    if (assessment.id === 'ppq') {
      return 'bg-green-100 text-green-600';
    }
    if (assessment.freeMonthly) {
      const hasFree = hasFreeMonthlyAssessment(assessment.id);
      if (hasFree) {
        return 'bg-green-100 text-green-600';
      } else {
        return 'bg-orange-100 text-orange-600';
      }
    }
    return 'bg-orange-100 text-orange-600';
  };

  const handleStart = () => {
    if (!assessmentId || !assessment) return;
    
    // 检查是否有免费机会
    const hasFree = hasFreeMonthlyAssessment(assessmentId);
    
    if (hasFree) {
      // 有免费机会，直接进入测评
      clearAssessmentProgress(assessmentId);
      navigate(`/assessment/${assessmentId}/quiz`);
    } else {
      // 需要付费
      const cost = assessment.price;
      setCoinCost(cost);
      setShowConfirmModal(true);
    }
  };

  const handleConfirmExchange = () => {
    if (!assessmentId || !assessment) return;
    
    const success = updateCoinBalance(-coinCost, `兑换${assessment.name}测评`);
    if (success) {
      setShowConfirmModal(false);
      clearAssessmentProgress(assessmentId);
      navigate(`/assessment/${assessmentId}/quiz`);
    } else {
      setShowConfirmModal(false);
      setShowInsufficientModal(true);
    }
  };

  const handleCloseModals = () => {
    setShowConfirmModal(false);
    setShowInsufficientModal(false);
  };

  if (!assessment) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">量表不存在</p>
          <button
            onClick={() => navigate('/assessments')}
            className="mt-4 text-primary hover:underline"
          >
            返回量表列表
          </button>
        </div>
      </div>
    );
  }

  const descriptions = assessmentId ? dimensionDescriptions[assessmentId] : {};
  const displayNames = assessmentId ? dimensionDisplayNames[assessmentId] : {};
  const hasFree = hasFreeMonthlyAssessment(assessmentId || '');

  return (
    <div className="page-container">
      <div className="sticky top-0 z-10 px-4 py-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-primary font-medium hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>返回</span>
        </button>
      </div>

      <div className="px-4 pb-6 text-center">
        <h1 className="text-xl font-bold text-primary">
          {assessment.name}（{assessment.shortName}）
        </h1>
      </div>

      {/* 白色内容区域 */}
      <div className="bg-white rounded-t-[24px] min-h-[calc(100vh-180px)] pt-6">
        <div className="px-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 bg-primary text-white rounded-xl p-4 flex items-center gap-3">
              <FileText className="w-6 h-6" />
              <div>
                <p className="text-sm opacity-90">共{assessment.questionCount}题</p>
              </div>
            </div>
            <div className="flex-1 bg-primary text-white rounded-xl p-4 flex items-center gap-3">
              <Clock className="w-6 h-6" />
              <div>
                <p className="text-sm opacity-90">{assessment.duration}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 价格信息卡片 */}
        <div className="px-4 mb-6">
          <div className={`rounded-xl p-4 border ${getPriceStyle()} border-current`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                <span className="font-bold">测评价格</span>
              </div>
              <span className="text-lg font-bold">{getPriceText()}</span>
            </div>
            {assessment.id !== 'ppq' && assessment.freeMonthly && hasFree && (
              <p className="text-xs mt-2 opacity-80">
                每月首次测评免费，之后需{assessment.price}心理货币兑换
              </p>
            )}
            {assessment.id !== 'ppq' && assessment.freeMonthly && !hasFree && (
              <p className="text-xs mt-2 opacity-80">
                本月免费次数已用完，需消耗心理货币兑换
              </p>
            )}
            {assessment.id !== 'ppq' && !assessment.freeMonthly && (
              <p className="text-xs mt-2 opacity-80">
                该量表无免费机会，每次测评需消耗心理货币兑换
              </p>
            )}
          </div>
        </div>

        <div className="px-4 mb-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h3 className="font-bold text-primary mb-3">测评说明</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {assessment.id === 'ppq' && (
                <>
                  大学/高中生活就像一场打怪升级的游戏：DDL（截止日期）接踵而至、小组作业遇到"划水"队友、精心准备的比赛没拿奖、别人绩点高实习好让你疯狂"内耗"……
                  <br /><br />
                  面对这些暴击，有的人会一蹶不振，有的人却能迅速"残血复活"。这背后的秘密武器，就是你的「积极心理资本」。它不是测你有没有心理问题，而是测你内心储存了多少应对校园挑战的"硬核能量"。
                </>
              )}
              {assessment.id === 'swls' && (
                <>
                  朋友圈里，大家都在晒高分、晒旅游、晒甜甜的恋爱。看看别人，再看看自己，你可能会在深夜里怀疑："我的校园生活，真的算过得好吗？"
                  <br /><br />
                  其实，幸福从来不等于全系第一名，也不等于拿满所有奖学金。这是一个享誉全球的经典迷你测评，它只关心一件事：抛开老师、家长和同龄人的标准，在你自己的主观世界里，你对现在的状态接纳吗？你觉得开心吗？
                </>
              )}
              {assessment.id === 'mlq' && (
                <>
                  "我选这个专业到底是为了什么？""每天像个陀螺一样上课、去图书馆，但我真的喜欢这些吗？"
                  <br /><br />
                  如果你常常感到空虚，或者正在经历传说中的"青春期/大学迷茫"，不要慌，这是寻找自我的必经之路。这个测评不负责对你进行说教，而是帮你理清思绪：在人生的这片海域里，你现在是已经找到了航向，还是正在勇敢地四处探索？
                </>
              )}
              {assessment.id === 'skus' && (
                <>
                  校园里最让人感到挫败的，是总觉得自己"干啥啥不行，干饭第一名"。但心理学表明，每个人都有独特的性格优势。你觉得痛苦，往往是因为：你根本不知道自己擅长什么，或者你待错了圈子！
                  <br /><br />
                  比如，你明明是个擅长共情的"倾听者"，却非要逼自己在辩论赛里当个"攻击手"。这个测试专治各种"不知道自己有多棒"和"才华无处施展"，帮你把性格里的闪光点，变成现实生活中的通关密码！
                </>
              )}
              {assessment.id === 'panas' && (
                <>
                  期末考前一天，你可能同时感到"终于快考完放假了"的兴奋，和"这科复习不完肯定要挂了"的焦虑。人的情绪是很复杂的，绝不是非黑即白。
                  <br /><br />
                  这个量表就像是一台"情绪X光机"，它不追问你为什么不开心，只负责精准捕捉你最近这段时间，内心到底翻涌着怎样复杂的情感波浪。测完后生成的"情绪柱状图"，能帮你打破错觉，看见最真实的自己。
                </>
              )}
              {assessment.id === 'ashs' && (
                <>
                  心理学上的"希望"，可不是躺在宿舍床上祈祷"明天会更好"的阿Q精神，而是一种硬核的解题能力！
                  <br /><br />
                  当你在学校遇到突如其来的打击——比如熬夜写的论文被毙了、心仪的实习被鸽了、或者和好朋友大吵一架陷入冷战时，你是会原地摆烂，还是能迅速找到出路？本测评将一针见血地指出你的"破局短板"，教你在这个充满变数的校园里做个行动派！
                </>
              )}
              {assessment.id === 'ers' && (
                <>
                  学生时代，没人能躲过所有的坑。被老师当众批评、被同学孤立误解、连续的考试失利……决定我们能走多远的，往往不是我们避免了多少麻烦，而是我们遭遇重击后的"自我恢复能力"。
                  <br /><br />
                  你的心理是一块一碰就碎的玻璃，还是一根能屈能伸、被压得越低弹得越高的弹簧？通过这个测试，看看你的"心理防弹衣"有多厚。系统还会告诉你，如何通过后天的日常小事，把这根弹簧锻炼得越来越强大。
                </>
              )}
              {assessment.id === 'erq' && (
                <>
                  室友大半夜打游戏吵到你、考卷出得难到离谱……当委屈、愤怒或极度焦虑袭来时，你是怎么处理的？
                  <br /><br />
                  有的人习惯自我安慰"算了吧，就当锻炼心态了"；有的人则习惯表面波澜不惊，心里却在疯狂骂街。情绪管理没有绝对的好坏，但如果用错了场合，就会疯狂内耗。测测你潜意识里最依赖哪种"情绪灭火器"，系统会帮你诊断这种方式是不是正在让你变得更憋屈！
                </>
              )}
              {assessment.id === 'rpws' && (
                <>
                  逃课睡一整天、通宵打游戏确实能带来短暂的快乐，但在狂欢之后，常常伴随的是巨大的空虚感。真正的幸福和成长，是内心深处的一种"踏实感"。
                  <br /><br />
                  这是一个关注你"深度心理发育"的重量级量表。它将跳出成绩单的单一评价，全方位扫描你的心智成熟度。测完后生成的高能"六维雷达图"，会像高亮荧光笔一样，圈出你在成长路上的"优势项"，帮你告别同龄人内耗，找到大学里最充盈、自洽的从容状态。
                </>
              )}
            </p>
          </div>
        </div>

        <div className="px-4 mb-6">
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <h3 className="font-bold text-secondary mb-3">测评维度</h3>
            <div className="space-y-3">
              {assessment.dimensions.map((dim) => (
                <div key={dim.key} className="text-gray-600 text-sm">
                  <p className="font-medium text-gray-800 mb-1">
                    {displayNames?.[dim.key] || dim.name}
                  </p>
                  {descriptions?.[dim.key] && (
                    <p className="text-gray-500 leading-relaxed pl-2 border-l-2 border-orange-300">
                      {descriptions[dim.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 pb-8">
          <button
            onClick={handleStart}
            className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg shadow-lg hover:bg-primary-dark transition-colors active:scale-[0.98] transform"
          >
            {hasFree ? '开始测评' : `消耗 ${assessment.price} 心理货币开始测评`}
          </button>
        </div>
      </div>

      {/* 确认兑换弹窗 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h3 className="text-xl font-bold text-center mb-4">兑换测评</h3>
            <p className="text-center text-gray-700 mb-6">
              该量表需{coinCost}个心理货币兑换，是否要兑换？
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleCloseModals}
                className="flex-1 py-3 border border-gray-300 rounded-full text-gray-700 font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmExchange}
                className="flex-1 py-3 bg-primary text-white rounded-full font-medium"
              >
                兑换
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 余额不足弹窗 */}
      {showInsufficientModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h3 className="text-xl font-bold text-center mb-4">提示</h3>
            <p className="text-center text-gray-700 mb-6">
              您的心理货币不足，请先完成日常任务获取心理货币
            </p>
            <button
              onClick={handleCloseModals}
              className="w-full py-3 bg-primary text-white rounded-full font-medium"
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import svgPaths from "./svg-ju6sxp2qdq";

function TextwrapperInlineThem() {
  return <div className="content-stretch flex items-center justify-center pb-[28px] pl-[40px] pr-[224px] pt-[24px] shrink-0" data-name="textwrapper-inline/them" />;
}

function TimestampThem() {
  return <div className="absolute bottom-[20px] content-stretch flex items-end justify-end right-[40px]" data-name="timestamp/them" />;
}

function Bubbletail() {
  return (
    <div className="h-[60px] relative w-[48px]" data-name="bubbletail">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 60">
        <g id="bubbletail">
          <path d={svgPaths.p337d7900} fill="var(--fill-0, white)" id="vector" />
        </g>
      </svg>
    </div>
  );
}

function TextBubbleTheme() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[127px] items-start left-[261px] rounded-[48px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.1)] top-[131px] w-[599px]" data-name="Text Bubble/Theme 2">
      <TextwrapperInlineThem />
      <TimestampThem />
      <div className="absolute bottom-0 flex h-[60px] items-center justify-center left-[-24px] w-[48px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <Bubbletail />
        </div>
      </div>
    </div>
  );
}

function TextwrapperInlineThem1() {
  return <div className="content-stretch flex items-center justify-center pb-[28px] pl-[40px] pr-[224px] pt-[24px] shrink-0" data-name="textwrapper-inline/them" />;
}

function TimestampThem1() {
  return <div className="absolute bottom-[20px] content-stretch flex items-end justify-end right-[40px]" data-name="timestamp/them" />;
}

function Bubbletail1() {
  return (
    <div className="h-[60px] relative w-[48px]" data-name="bubbletail">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 60">
        <g id="bubbletail">
          <path d={svgPaths.p337d7900} fill="var(--fill-0, white)" id="vector" />
        </g>
      </svg>
    </div>
  );
}

function TextBubbleTheme1() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[482px] items-start relative rounded-[48px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.1)] w-[1207px]" data-name="Text Bubble/Theme 3">
      <TextwrapperInlineThem1 />
      <TimestampThem1 />
      <div className="absolute bottom-0 flex h-[60px] items-center justify-center left-[-24px] w-[48px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <Bubbletail1 />
        </div>
      </div>
    </div>
  );
}

function TextInput() {
  return (
    <div className="bg-[#f3f3f5] h-[106px] relative rounded-[14px] shrink-0 w-[1356px]" data-name="Text Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip px-[12px] py-[4px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[32px] tracking-[-0.1504px]">Type your response...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[85px] relative shrink-0 w-[95px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 95 85">
        <g id="Icon">
          <path d={svgPaths.p14208af0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pe2f280} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-gradient-to-r from-[#155dfc] h-[133px] opacity-50 relative rounded-[14px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] shrink-0 to-[rgba(154,228,167,0.86)] w-[151px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[12px] h-[137px] items-end relative shrink-0 w-full" data-name="Container">
      <TextInput />
      <Button />
    </div>
  );
}

function Paragraph() {
  return <div className="h-[16px] shrink-0 w-full" data-name="Paragraph" />;
}

function Container() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[8px] h-[228px] items-start left-0 pt-[17px] px-[16px] top-[889px] w-[1728px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-solid border-t inset-0 pointer-events-none" />
      <Container1 />
      <Paragraph />
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[48px] leading-[16px] not-italic relative shrink-0 text-[#99a1af] text-[24px] text-center w-[751px] whitespace-pre-wrap">{` Type your message`}</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-gradient-to-r content-stretch flex from-[#155dfc] h-[133px] items-center justify-center left-[1547px] opacity-50 rounded-[14px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] to-[rgba(154,228,167,0.86)] top-[45px] w-[151px]" data-name="Button">
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[67px] leading-[24px] not-italic relative shrink-0 text-[36px] text-white tracking-[-0.3125px] w-[117px] whitespace-pre-wrap">Home</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-gradient-to-r content-stretch flex from-[#155dfc] h-[133px] items-center justify-center left-[1547px] opacity-50 rounded-[14px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] to-[rgba(154,228,167,0.86)] top-[45px] w-[151px]" data-name="Button">
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[67px] leading-[24px] not-italic relative shrink-0 text-[36px] text-white tracking-[-0.3125px] w-[117px] whitespace-pre-wrap">Home</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-gradient-to-r content-stretch flex from-[#155dfc] h-[133px] items-center justify-center left-[1547px] opacity-50 rounded-[14px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] to-[rgba(154,228,167,0.86)] top-[45px] w-[151px]" data-name="Button">
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[67px] leading-[24px] not-italic relative shrink-0 text-[36px] text-white tracking-[-0.3125px] w-[117px] whitespace-pre-wrap">Home</p>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-gradient-to-r content-stretch flex from-[#155dfc] h-[133px] items-center justify-center left-[1542px] opacity-50 rounded-[14px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] to-[rgba(154,228,167,0.86)] top-[221px] w-[151px]" data-name="Button">
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[67px] leading-[24px] not-italic relative shrink-0 text-[36px] text-white tracking-[-0.3125px] w-[117px] whitespace-pre-wrap">Levels</p>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-gradient-to-r content-stretch flex from-[#155dfc] h-[133px] items-center justify-center left-[1542px] opacity-50 rounded-[14px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] to-[rgba(154,228,167,0.86)] top-[221px] w-[151px]" data-name="Button">
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[67px] leading-[24px] not-italic relative shrink-0 text-[36px] text-white tracking-[-0.3125px] w-[117px] whitespace-pre-wrap">Levels</p>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute bg-gradient-to-r content-stretch flex from-[#155dfc] h-[133px] items-center justify-center left-[1542px] opacity-50 rounded-[14px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] to-[rgba(154,228,167,0.86)] top-[221px] w-[151px]" data-name="Button">
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[67px] leading-[24px] not-italic relative shrink-0 text-[36px] text-white tracking-[-0.3125px] w-[117px] whitespace-pre-wrap">Levels</p>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute bg-gradient-to-r content-stretch flex from-[#155dfc] h-[133px] items-center justify-center left-[1542px] opacity-50 rounded-[14px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] to-[rgba(154,228,167,0.86)] top-[221px] w-[151px]" data-name="Button">
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[67px] leading-[24px] not-italic relative shrink-0 text-[36px] text-white tracking-[-0.3125px] w-[117px] whitespace-pre-wrap">Levels</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[52px] left-[275px] top-[149px] w-[994px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[89px] leading-[24px] left-0 not-italic text-[#1e2939] text-[24px] top-[-1px] tracking-[-0.3125px] w-[835px] whitespace-pre-wrap">{`Hello! I'm your Debate Partner. Shall we start?`}</p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[144px] relative shrink-0 w-[126px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 126 144">
        <g id="Icon">
          <path d="M63 48V24H42" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2c7bb800} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10.5 84H21" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M105 84H115.5" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M78.75 78V90" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M47.25 78V90" id="Vector_6" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex h-[196px] items-center justify-center left-[47px] rounded-[16777200px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] top-[105px] w-[198px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135.291deg, rgb(81, 162, 255) 0%, rgba(154, 228, 167, 0.86) 100%)" }}>
      <Icon1 />
    </div>
  );
}

function PersonHead() {
  return (
    <div className="h-[134px] relative shrink-0 w-[148px]" data-name="person-head">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 148 134">
        <g id="person-head">
          <path clipRule="evenodd" d={svgPaths.p1c3d28c0} fill="var(--fill-0, white)" fillRule="evenodd" id="shape" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex h-[196px] items-center justify-center left-[1528px] rounded-[16777200px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] top-[608px] w-[198px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135.291deg, rgb(81, 162, 255) 0%, rgba(154, 228, 167, 0.86) 100%)" }}>
      <PersonHead />
    </div>
  );
}

export default function OnlyTextModality() {
  return (
    <div className="bg-gradient-to-b from-[rgba(154,228,167,0.86)] relative size-full to-[62.883%] to-white" data-name="Only text modality">
      <TextBubbleTheme />
      <div className="absolute flex h-[482px] items-center justify-center left-[297px] top-[337px] w-[1207px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <TextBubbleTheme1 />
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[373px] leading-[40px] left-[337px] not-italic text-[#010101] text-[24px] top-[354px] w-[1094px] whitespace-pre-wrap">{`Let’s debate if billionaires should exist. I don’t think they should. Billionaires represent a fundamental policy failure that destabilises both the economy and the democratic process. The sheer scale of wealth concentration—where a few thousand individuals control more resources than billions of people combined—is not a sign of a healthy market, but of systemic extraction that suppresses wages and starves public infrastructure. This extreme disparity grants the ultra-wealthy "inordinate control" over political systems, effectively allowing them to buy influence and bypass the democratic will of the majority. Furthermore, when capital is hoarded at the top rather than circulated through the middle class, economic dynamism actually slows down. In a world where basic human needs like healthcare and climate adaptation remain chronically underfunded, the existence of billionaires is a moral and structural indulgence that society can no longer afford to sustain`}</p>
      <Container />
      <Button1 />
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
      <Button6 />
      <Button7 />
      <Paragraph1 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[1151px] not-italic text-[#99a1af] text-[32px] top-[789px]">12:10 AM</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[297px] not-italic text-[#99a1af] text-[32px] top-[218px]">12:05 AM</p>
      <Container2 />
      <Container3 />
    </div>
  );
}
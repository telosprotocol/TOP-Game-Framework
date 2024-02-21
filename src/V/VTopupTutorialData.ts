import { webpFilter } from '@/directives/webp';
export type ITopupTInfoGroupItem = {
  groupName: string;
  icon: string;
  list: ITopupTInfoSubListItem[];
};
export type ITopupTInfoSubListItem = {
  subType?: string;
  icon?: string;
  stepList: {
    img: string[];
    /**
     *   320,
     */
    width?: number;
  }[];
};

/**
 * TODO:     s3,      ，
 */
export const TOPUP_TUTORIAL_DATA: ITopupTInfoGroupItem[] = [
  {
    groupName: 'DANA',
    icon: webpFilter(require('@/assets/topupTutorial/dana@2x.png?webp')),
    list: [
      {
        stepList: [
          {
            img: [webpFilter('/online/topupTutorial/step1/dana.png?webp')],
            width: 360,
          },
          {
            img: [webpFilter('/online/topupTutorial/Step2DANA.png?webp')],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step3DANA.png?webp')],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step4DANA.png?webp')],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step5DANA.png?webp')],
          },
        ],
      },
    ],
  },
  {
    groupName: 'OVO',
    icon: webpFilter(require('@/assets/topupTutorial/ovo@2x.png?webp')),
    list: [
      {
        stepList: [
          {
            img: [webpFilter('/online/topupTutorial/step1/ovo.png?webp')],
            width: 360,
          },
          {
            img: [webpFilter('/online/topupTutorial/Step2OVO.png?webp')],
          },
          {
            img: [
              webpFilter('/online/topupTutorial/Step3OVO1.png?webp'),
              webpFilter('/online/topupTutorial/Step3OVO2.png?webp'),
            ],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step4OVO.png?webp')],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step5OVO.png?webp')],
          },
        ],
      },
    ],
  },
  {
    groupName: 'VA',
    icon: webpFilter(require('@/assets/topupTutorial/va@2x.png?webp')),
    list: [
      {
        subType: 'BCA',
        icon: webpFilter(require('@/assets/topupTutorial/bca@2x.png?webp')),
        //BCA
        stepList: [
          {
            img: [webpFilter('/online/topupTutorial/step1/va.png?webp')],
            width: 360,
          },
          {
            img: [webpFilter('/online/topupTutorial/choosebank/bca.png?webp')],
            width: 360,
          },
          {
            img: [webpFilter('/online/topupTutorial/Step3BCA.png?webp')],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step4BCA.png?webp')],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step5BCA.png?webp')],
          },
          {
            img: [
              webpFilter('/online/topupTutorial/Step6BCA1.png?webp'),
              webpFilter('/online/topupTutorial/Step6BCA2.png?webp'),
            ],
          },
          {
            img: [
              webpFilter('/online/topupTutorial/Step7BCA1.png?webp'),
              webpFilter('/online/topupTutorial/Step7BCA2.png?webp'),
            ],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step8BCA.png?webp')],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step9BCA.png?webp')],
          },
        ],
      },
      {
        subType: 'MANDIRI',
        icon: webpFilter(require('@/assets/topupTutorial/mandiri@2x.png?webp')),
        //MANDIRI
        stepList: [
          {
            img: [webpFilter('/online/topupTutorial/step1/va.png?webp')],
            width: 360,
          },
          {
            img: [
              webpFilter('/online/topupTutorial/choosebank/mandiri.png?webp'),
            ],
            width: 360,
          },
          {
            img: [webpFilter('/online/topupTutorial/Step3MANDIRI.png?webp')],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step4MANDIRI.png?webp')],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step5BCA.png?webp')],
          },
          {
            img: [
              webpFilter('/online/topupTutorial/Step6MANDIRI1.png?webp'),
              webpFilter('/online/topupTutorial/Step6MANDIRI2.png?webp'),
            ],
          },
          {
            img: [
              webpFilter('/online/topupTutorial/Step7MANDIRI1.png?webp'),
              webpFilter('/online/topupTutorial/Step7MANDIRI2.png?webp'),
            ],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step8MANDIRI.png?webp')],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step9MANDIRI.png?webp')],
          },
        ],
      },
      {
        subType: 'BNI',
        icon: webpFilter(require('@/assets/topupTutorial/bni@2x.png?webp')),
        //BNI
        stepList: [
          {
            img: [webpFilter('/online/topupTutorial/step1/va.png?webp')],
            width: 360,
          },
          {
            img: [webpFilter('/online/topupTutorial/choosebank/bni.png?webp')],
            width: 360,
          },
          {
            img: [webpFilter('/online/topupTutorial/Step3BNI.png?webp')],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step4BNI.png?webp')],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step5BNI.png?webp')],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step6BNI.png?webp')],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step7BNI.png?webp')],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step8BNI.png?webp')],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step9BNI.png?webp')],
          },
        ],
      },
    ],
  },
  {
    groupName: 'QRIS',
    icon: webpFilter(require('@/assets/topupTutorial/qris@2x.png?webp')),

    list: [
      {
        stepList: [
          {
            img: [webpFilter('/online/topupTutorial/step1/qris.png?webp')],
            width: 360,
          },
          {
            img: [webpFilter('/online/topupTutorial/Step2QRIS.png?webp')],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step3QRIS.png?webp')],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step4QRIS.png?webp')],
          },
          {
            img: [webpFilter('/online/topupTutorial/Step5QRIS.png?webp')],
          },
        ],
      },
    ],
  },
];

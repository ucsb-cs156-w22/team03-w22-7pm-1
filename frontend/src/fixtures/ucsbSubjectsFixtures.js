const subjectFixtures = {
    oneSubject: {
        "id": 1,
        "subjectCode": "CMPSC",
        "subjectTranslation": "Computer Science",
        "deptCode": "ENGR",
        "collegeCode": "UCSB",     //EX: IDK WHAT TO PUT FOR THESE "DUNNO"'S
        "relatedDeptCode": "DUNNO",
        "inactive": "false"
    },
    twoSubjects: [
        {
            "id": 1,
            "subjectCode": "CMPSC",
            "subjectTranslation": "Computer Science",
            "deptCode": "ENGR",
            "collegeCode": "UCSB",
            "relatedDeptCode": "DUNNO",
            "inactive": "false"
        },
        {
            "id": 2,
            "subjectCode": "COMM",
            "subjectTranslation": "Communications",
            "deptCode": "L&S",
            "collegeCode": "UCSB",
            "relatedDeptCode": "DUNNO",
            "inactive": "false"
        }

    ]
};


export { subjectFixtures };
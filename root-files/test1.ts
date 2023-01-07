const ok = {
  path: "-",
  child: [
    {
      path: "--",
      child: [
        { path: "---" },
        { path: "---", child: [{ path: "----" }, { path: "----" }] },
        {
          path: "---",
          child: [
            { path: "----" },
            {
              path: "----",
              child: [{ path: "-----", child: [{ path: "------" }] }],
            },
          ],
        },
      ],
    },
    {
      path: "--",
      child: [
        {
          path: "---",
          child: [
            {
              path: "----",
              child: [
                { path: "-----" },
                { path: "-----", child: [{ path: "------" }] },
                {
                  path: "-----",
                  child: [
                    {
                      path: "------",
                      child: [{ path: "-------" }, { path: "-------" }],
                    },
                    {
                      path: "------",
                      child: [
                        { path: "-------" },
                        {
                          path: "-------",
                          child: [
                            {
                              path: "--------",
                              child: [
                                {
                                  path: "---------",
                                  child: [
                                    { path: "----------" },
                                    { path: "----------" },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    { path: "--", child: [{ path: "---" }] },
  ],
};

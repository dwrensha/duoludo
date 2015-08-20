@0xe4e653bbd493f0cb;

using Spk = import "/sandstorm/package.capnp";
# This imports:
#   $SANDSTORM_HOME/latest/usr/include/sandstorm/package.capnp
# Check out that file to see the full, documented package definition format.

const pkgdef :Spk.PackageDefinition = (
  # The package definition. Note that the spk tool looks specifically for the
  # "pkgdef" constant.

  id = "yx8a62h5ytxdcnhvxuq9t5r2fngr1yfvs5sw776e7vv2zrx68u4h",
  # Your app ID is actually its public key. The private key was placed in
  # your keyring. All updates must be signed with the same key.

  manifest = (
    # This manifest is included in your app package to tell Sandstorm
    # about your app.

    appTitle = (defaultText = "Duoludo"),

    appVersion = 1,  # Increment this for every release.
    appMarketingVersion = (defaultText = "2015.08.20"),

    metadata = (
      icons = (
        appGrid = (svg = embed "app-graphics/duoludo-128.svg"),
        grain = (svg = embed "app-graphics/duoludo-24.svg"),
        market = (svg = embed "app-graphics/duoludo-150.svg"),
      ),
      website = "https://dwrensha.ws/duoludo",
      codeUrl = "https://github.com/dwrensha/duoludo",
      license = (openSource = bsd3Clause),
      categories = [games,],
      author = (
        contactEmail = "david@sandstorm.io",
        pgpSignature = embed "pgp-signature",
      ),
      pgpKeyring = embed "pgp-keyring",
      description = (defaultText = embed "description.md"),
      screenshots = [(width = 448, height = 359, png = embed "screenshot.png")],
      changeLog = (defaultText = embed "changeLog.md"),
    ),


    actions = [
      ( title = (defaultText = "New Duoludo game"),
        nounPhrase = (defaultText = "Duoludo game"),
        command = .startCommand
      )
    ],

    continueCommand = .continueCommand
  ),

  sourceMap = (
    # Here we defined where to look for files to copy into your package. The
    # `spk dev` command actually figures out what files your app needs
    # automatically by running it on a FUSE filesystem. So, the mappings
    # here are only to tell it where to find files that the app wants.
    searchPath = [

      # Ugh, we need to include this stuff to migrate from niscu.
      ( sourcePath = "./niscud", packagePath = "usr/bin/niscud"),
      ( sourcePath = "./mongod.conf", packagePath = "etc/mongod.conf"),

      # This is the actual mongo configuration we will use once we've migrated.
      ( sourcePath = "./mongod.wiredTiger.conf", packagePath = "etc/mongod.wiredTiger.conf"),
      (
        sourcePath = "/",
        hidePaths = [ "home", "proc", "sys",
                      "etc/passwd", "etc/hosts", "etc/host.conf",
                      "etc/nsswitch.conf", "etc/resolv.conf" ]
        # You probably don't want the app pulling files from these places,
        # so we hide them. Note that /dev, /var, and /tmp are implicitly
        # hidden because Sandstorm itself provides them.
      )
    ]
  ),

  fileList = "sandstorm-files.list",

  alwaysInclude = ["opt/app/node_modules"]
);

const startCommand :Spk.Manifest.Command = (
  argv = ["/sandstorm-http-bridge", "8080", "--", "/opt/app/.sandstorm/run-first-time.sh"],
  environ = [
    (key = "PATH", value = "/usr/local/bin:/usr/bin:/bin")
  ]
);

const continueCommand :Spk.Manifest.Command = (
  argv = ["/sandstorm-http-bridge", "8080", "--", "/opt/app/.sandstorm/run-continue.sh"],
  environ = [
    (key = "PATH", value = "/usr/local/bin:/usr/bin:/bin")
  ]
);
